import {
  Stack,
  StackProps,
  CfnOutput,
  RemovalPolicy,
  Duration,
} from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { Bucket, BlockPublicAccess } from 'aws-cdk-lib/aws-s3'
import {
  Distribution,
  OriginAccessIdentity,
  ViewerProtocolPolicy,
  CachePolicy,
  AllowedMethods,
  CachedMethods,
  PriceClass,
} from 'aws-cdk-lib/aws-cloudfront'
import { S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins'
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment'
import { PolicyStatement, CanonicalUserPrincipal } from 'aws-cdk-lib/aws-iam'

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    // Create S3 bucket for hosting the workshop
    const workshopBucket = new Bucket(this, 'WorkshopBucket', {
      bucketName: `aws-workshop-${this.account}-${this.region}`,
      publicReadAccess: false,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY, // For easy cleanup
      autoDeleteObjects: true, // For easy cleanup
    })

    // Create Origin Access Identity for CloudFront
    const originAccessIdentity = new OriginAccessIdentity(this, 'WorkshopOAI', {
      comment: 'OAI for AWS Workshop',
    })

    // Grant CloudFront access to S3 bucket
    workshopBucket.addToResourcePolicy(
      new PolicyStatement({
        actions: ['s3:GetObject'],
        resources: [workshopBucket.arnForObjects('*')],
        principals: [
          new CanonicalUserPrincipal(
            originAccessIdentity.cloudFrontOriginAccessIdentityS3CanonicalUserId
          ),
        ],
      })
    )

    // Create CloudFront distribution
    const distribution = new Distribution(this, 'WorkshopDistribution', {
      defaultBehavior: {
        origin: S3BucketOrigin.withOriginAccessIdentity(workshopBucket, {
          originAccessIdentity,
        }),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: CachePolicy.CACHING_DISABLED, // ← Changed to DISABLED
        allowedMethods: AllowedMethods.ALLOW_GET_HEAD,
        cachedMethods: CachedMethods.CACHE_GET_HEAD,
      },
      additionalBehaviors: {
        // Handle media assets with caching (images are safe to cache)
        'media/*': {
          origin: S3BucketOrigin.withOriginAccessIdentity(workshopBucket, {
            originAccessIdentity,
          }),
          viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: CachePolicy.CACHING_OPTIMIZED,
        },
      },
      defaultRootObject: 'index.html',
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
