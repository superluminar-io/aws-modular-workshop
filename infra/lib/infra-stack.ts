import {
  Aspects,
  Stack,
  StackProps,
  CfnOutput,
  RemovalPolicy,
  Duration,
} from 'aws-cdk-lib'
import { Construct } from 'constructs'
import {
  Bucket,
  BlockPublicAccess,
  BucketEncryption,
  ObjectOwnership,
} from 'aws-cdk-lib/aws-s3'
import {
  Distribution,
  ViewerProtocolPolicy,
  CachePolicy,
  AllowedMethods,
  CachedMethods,
  PriceClass,
  ResponseHeadersPolicy,
  HeadersFrameOption,
  HeadersReferrerPolicy,
  HttpVersion,
} from 'aws-cdk-lib/aws-cloudfront'
import { S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins'
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment'
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch'
import { AwsSolutionsChecks, NagSuppressions } from 'cdk-nag'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as cognito from 'aws-cdk-lib/aws-cognito'
import {
  AwsCustomResource,
  AwsCustomResourcePolicy,
  PhysicalResourceId,
} from 'aws-cdk-lib/custom-resources'

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    // Access logs bucket (for S3 and CloudFront)
    const logsBucket = new Bucket(this, 'AccessLogsBucket', {
      bucketName: `aws-workshop-logs-${this.account}-${this.region}`,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      encryption: BucketEncryption.S3_MANAGED,
      objectOwnership: ObjectOwnership.BUCKET_OWNER_PREFERRED,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      lifecycleRules: [{ expiration: Duration.days(30) }],
    })

    // Enforce SSL for logs bucket (cdk-nag S10)
    logsBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        sid: 'DenyInsecureTransport',
        effect: iam.Effect.DENY,
        principals: [new iam.AnyPrincipal()],
        actions: ['s3:*'],
        resources: [logsBucket.bucketArn, logsBucket.arnForObjects('*')],
        conditions: { Bool: { 'aws:SecureTransport': 'false' } },
      }),
    )

    // Create S3 bucket for hosting the workshop
    const workshopBucket = new Bucket(this, 'WorkshopBucket', {
      bucketName: `aws-workshop-${this.account}-${this.region}`,
      publicReadAccess: false,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY, // For easy cleanup
      autoDeleteObjects: true, // For easy cleanup
      encryption: BucketEncryption.S3_MANAGED,
      serverAccessLogsBucket: logsBucket,
      serverAccessLogsPrefix: 's3/',
    })

    // Enforce SSL for site bucket (cdk-nag S10)
    workshopBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        sid: 'DenyInsecureTransport',
        effect: iam.Effect.DENY,
        principals: [new iam.AnyPrincipal()],
        actions: ['s3:*'],
        resources: [
          workshopBucket.bucketArn,
          workshopBucket.arnForObjects('*'),
        ],
        conditions: { Bool: { 'aws:SecureTransport': 'false' } },
      }),
    )

    // Using CloudFront Origin Access Control (OAC) via S3BucketOrigin; no OAI/policy needed

    // Security headers policy
    const securityHeaders = new ResponseHeadersPolicy(this, 'SecurityHeaders', {
      comment: 'Security headers for workshop site',
      securityHeadersBehavior: {
        contentSecurityPolicy: {
          contentSecurityPolicy:
            "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval'",
          override: true,
        },
        contentTypeOptions: { override: true },
        frameOptions: { frameOption: HeadersFrameOption.DENY, override: true },
        referrerPolicy: {
          referrerPolicy: HeadersReferrerPolicy.NO_REFERRER_WHEN_DOWNGRADE,
          override: true,
        },
        strictTransportSecurity: {
          accessControlMaxAge: Duration.days(365),
          includeSubdomains: true,
          preload: true,
          override: true,
        },
        xssProtection: { protection: true, modeBlock: true, override: true },
      },
    })

    // Create CloudFront distribution
    const distribution = new Distribution(this, 'WorkshopDistribution', {
      defaultBehavior: {
        origin: S3BucketOrigin.withOriginAccessControl(workshopBucket),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: CachePolicy.CACHING_DISABLED,
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
        cachedMethods: CachedMethods.CACHE_GET_HEAD,
        responseHeadersPolicy: securityHeaders,
        compress: true,
      },
      additionalBehaviors: {
        // Handle media assets with caching (images are safe to cache)
        'media/*': {
          origin: S3BucketOrigin.withOriginAccessControl(workshopBucket),
          viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: CachePolicy.CACHING_OPTIMIZED,
          responseHeadersPolicy: securityHeaders,
          compress: true,
        },
      },
      defaultRootObject: 'index.html',
      httpVersion: HttpVersion.HTTP2_AND_3,
      enableLogging: true,
      logBucket: logsBucket,
      logFilePrefix: 'cloudfront/',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: Duration.minutes(1),
        },
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: Duration.minutes(1),
        },
      ],
      priceClass: PriceClass.PRICE_CLASS_100, // Use only edge locations in US, Canada, and Europe
    })

    // Deploy workshop content to S3
    const siteDeployment = new BucketDeployment(this, 'DeployWorkshop', {
      sources: [Source.asset('../docs')], // Deploy the docs folder from parent directory
      destinationBucket: workshopBucket,
      distribution,
      distributionPaths: ['/*'],
      memoryLimit: 512,
      prune: false,
    })

    // WAF disabled by default for global CloudFront to keep single-region deploy simple.
    // You can enable WAF by creating a WebACL in us-east-1 and associating it to the distribution.

    // Suppress CloudFront rules where intent is documented
    NagSuppressions.addResourceSuppressions(distribution, [
      {
        id: 'AwsSolutions-CFR1',
        reason: 'Geo restriction is not required for this public demo site.',
      },
      {
        id: 'AwsSolutions-CFR4',
        reason:
          'Demo uses default viewer certificate without ACM; TLS policy override not configured.',
      },
    ])

    // CloudFront 4xx/5xx alarms
    const error5xxMetric = new cloudwatch.Metric({
      namespace: 'AWS/CloudFront',
      metricName: '5xxErrorRate',
      dimensionsMap: {
        DistributionId: distribution.distributionId,
        Region: 'Global',
      },
      period: Duration.minutes(5),
      statistic: 'Average',
    })
    const error4xxMetric = new cloudwatch.Metric({
      namespace: 'AWS/CloudFront',
      metricName: '4xxErrorRate',
      dimensionsMap: {
        DistributionId: distribution.distributionId,
        Region: 'Global',
      },
      period: Duration.minutes(5),
      statistic: 'Average',
    })

    new cloudwatch.Alarm(this, 'CloudFront5xxAlarm', {
      metric: error5xxMetric,
      threshold: 1,
      evaluationPeriods: 1,
      datapointsToAlarm: 1,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    })

    new cloudwatch.Alarm(this, 'CloudFront4xxAlarm', {
      metric: error4xxMetric,
      threshold: 5,
      evaluationPeriods: 1,
      datapointsToAlarm: 1,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    })

    // Enable cdk-nag (AWS Solutions checks)
    Aspects.of(this).add(new AwsSolutionsChecks({ verbose: true }))

    // Cognito Identity Pool for client-side AWS Translate (no backend required)

    const identityPool = new cognito.CfnIdentityPool(
      this,
      'WorkshopIdentityPool',
      {
        identityPoolName: `workshop-translate-${this.region}`,
        allowUnauthenticatedIdentities: true,
      },
    )

    // Suppress unauthenticated identities (COG7) with justification
    NagSuppressions.addResourceSuppressions(identityPool, [
      {
        id: 'AwsSolutions-COG7',
        reason:
          'Browser-only Translate demo requires unauthenticated identity; scoped to workshop.',
      },
    ])

    // Unauthenticated role for Identity Pool with scoped trust to this pool
    const translateUnauthRole = new iam.Role(this, 'TranslateUnauthRole', {
      assumedBy: new iam.FederatedPrincipal(
        'cognito-identity.amazonaws.com',
        {
          StringEquals: {
            'cognito-identity.amazonaws.com:aud': identityPool.ref,
          },
          'ForAnyValue:StringLike': {
            'cognito-identity.amazonaws.com:amr': 'unauthenticated',
          },
        },
        'sts:AssumeRoleWithWebIdentity',
      ),
      description:
        'Unauthenticated role allowing translate:TranslateText for demo translation',
    })

    translateUnauthRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ['translate:TranslateText'],
        resources: ['*'],
      }),
    )

    new cognito.CfnIdentityPoolRoleAttachment(this, 'IdentityPoolRoles', {
      identityPoolId: identityPool.ref,
      roles: {
        unauthenticated: translateUnauthRole.roleArn,
      },
    })

    // Outputs
    new CfnOutput(this, 'WorkshopURL', {
      value: `https://${distribution.distributionDomainName}`,
      description: 'AWS Workshop CloudFront URL',
      exportName: 'WorkshopURL',
    })

    new CfnOutput(this, 'DistributionId', {
      value: distribution.distributionId,
      description: 'CloudFront Distribution ID',
      exportName: 'DistributionId',
    })

    new CfnOutput(this, 'S3BucketName', {
      value: workshopBucket.bucketName,
      description: 'S3 Bucket hosting the workshop',
      exportName: 'S3BucketName',
    })

    new CfnOutput(this, 'WorkshopDomain', {
      value: distribution.distributionDomainName,
      description: 'CloudFront Domain Name',
      exportName: 'WorkshopDomain',
    })

    new CfnOutput(this, 'TranslateIdentityPoolId', {
      value: identityPool.ref,
      description: 'Cognito Identity Pool ID for browser-based translation',
      exportName: 'TranslateIdentityPoolId',
    })

    // Write dynamic config.js to the site bucket (contains region and Identity Pool ID)
    const configBody = `// Workshop Configuration - Automatically generated by CDK
window.WORKSHOP_CONFIG = {
  // AWS Region for services
  region: "${this.region}",

  // Cognito Identity Pool ID for unauthenticated access to AWS Translate
  translateIdentityPoolId: "${identityPool.ref}",

  // Workshop metadata
  workshopName: "AWS Modular Workshop",
  version: "1.0.0",

  // Feature flags
  features: {
    translation: true,
    analytics: false,
    feedback: false
  },

  // Translation settings
  translation: {
    defaultLanguage: "en",
    supportedLanguages: ["en", "de"],
    cacheEnabled: true,
    batchSize: 25,
    requestDelay: 60 // ms between batch requests
  },

  // Development/Debug settings
  debug: {
    logTranslations: false,
    mockTranslations: false,
    showAWSErrors: false
  }
};

// Helper function to check if translation is properly configured
window.isTranslationConfigured = function() {
  return !!(
    window.WORKSHOP_CONFIG &&
    window.WORKSHOP_CONFIG.translateIdentityPoolId &&
    window.WORKSHOP_CONFIG.features &&
    window.WORKSHOP_CONFIG.features.translation
  );
};`

    const writeConfig = new AwsCustomResource(this, 'WriteConfigJs', {
      onCreate: {
        service: 'S3',
        action: 'putObject',
        parameters: {
          Bucket: workshopBucket.bucketName,
          Key: 'config.js',
          Body: configBody,
          ContentType: 'application/javascript',
          CacheControl: 'no-store, no-cache, must-revalidate',
        },
        physicalResourceId: PhysicalResourceId.of('config-js-create'),
      },
      onUpdate: {
        service: 'S3',
        action: 'putObject',
        parameters: {
          Bucket: workshopBucket.bucketName,
          Key: 'config.js',
          Body: configBody,
          ContentType: 'application/javascript',
          CacheControl: 'no-store, no-cache, must-revalidate',
        },
        physicalResourceId: PhysicalResourceId.of('config-js-update'),
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
    })

    // Ensure config.js is written after site upload
    // Note: BucketDeployment already handles CloudFront invalidation for all files (distributionPaths: ['/*'])
    writeConfig.node.addDependency(siteDeployment)

    // Suppress broad IAM on CDK-managed asset/custom resource roles and CDK-managed Lambda runtime
    NagSuppressions.addResourceSuppressions(
      this,
      [
        {
          id: 'AwsSolutions-IAM4',
          reason:
            'CDK-managed roles for assets/custom resources may attach AWS managed policies.',
        },
        {
          id: 'AwsSolutions-IAM5',
          reason:
            'Wildcard permissions limited to CDK asset buckets and necessary actions for deployments.',
        },
        {
          id: 'AwsSolutions-L1',
          reason:
            'Non-container Lambdas created by CDK (assets/custom resources) have runtime controlled by CDK.',
        },
      ],
      true,
    )
  }
}
