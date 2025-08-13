import {
  Aspects,
  Stack,
  StackProps,
  CfnOutput,
  RemovalPolicy,
  Duration,
} from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { Bucket, BlockPublicAccess, BucketEncryption } from 'aws-cdk-lib/aws-s3'
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
import * as wafv2 from 'aws-cdk-lib/aws-wafv2'
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch'
import { AwsSolutionsChecks } from 'cdk-nag'

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    // Access logs bucket (for S3 and CloudFront)
    const logsBucket = new Bucket(this, 'AccessLogsBucket', {
      bucketName: `aws-workshop-logs-${this.account}-${this.region}`,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      encryption: BucketEncryption.S3_MANAGED,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      lifecycleRules: [{ expiration: Duration.days(30) }],
    })

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
    new BucketDeployment(this, 'DeployWorkshop', {
      sources: [Source.asset('../docs')], // Deploy the docs folder from parent directory
      destinationBucket: workshopBucket,
      distribution,
      distributionPaths: ['/*'],
      memoryLimit: 512,
    })

    // Associate WAF (AWS Managed Rules)
    const webAcl = new wafv2.CfnWebACL(this, 'WorkshopWebAcl', {
      defaultAction: { allow: {} },
      scope: 'CLOUDFRONT',
      visibilityConfig: {
        cloudWatchMetricsEnabled: true,
        metricName: 'workshop-web-acl',
        sampledRequestsEnabled: true,
      },
      rules: [
        {
          name: 'AWS-AWSManagedRulesCommonRuleSet',
          priority: 1,
          overrideAction: { none: {} },
          statement: {
            managedRuleGroupStatement: {
              vendorName: 'AWS',
              name: 'AWSManagedRulesCommonRuleSet',
            },
          },
          visibilityConfig: {
            cloudWatchMetricsEnabled: true,
            metricName: 'aws-common',
            sampledRequestsEnabled: true,
          },
        },
        {
          name: 'AWS-AWSManagedRulesKnownBadInputsRuleSet',
          priority: 2,
          overrideAction: { none: {} },
          statement: {
            managedRuleGroupStatement: {
              vendorName: 'AWS',
              name: 'AWSManagedRulesKnownBadInputsRuleSet',
            },
          },
          visibilityConfig: {
            cloudWatchMetricsEnabled: true,
            metricName: 'aws-known-bad',
            sampledRequestsEnabled: true,
          },
        },
      ],
    })

    new wafv2.CfnWebACLAssociation(this, 'WebAclAssociation', {
      resourceArn: distribution.distributionArn,
      webAclArn: webAcl.attrArn,
    })

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
  }
}
