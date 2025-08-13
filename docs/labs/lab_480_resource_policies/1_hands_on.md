# AWS Resource Policies - Hands-on Lab

## Prerequisites

> Tip: Set an AWS profile for this shell to avoid repeating profile flags
```bash
export AWS_PROFILE=your-profile-name
```


- AWS CDK and AWS CLI configured
- Multiple AWS accounts (recommended for cross-account scenarios)
- Completed IAM lab

## Step 1: Create the Lab Infrastructure

Create a new file `lib/resource-policies-stack.ts`:

```typescript:lib/resource-policies-stack.ts
import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class ResourcePoliciesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create S3 bucket with bucket policy
    const bucket = new s3.Bucket(this, 'ResourcePolicyBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Add bucket policy
    const bucketPolicy = new s3.BucketPolicy(this, 'BucketPolicy', {
      bucket: bucket,
    });

    bucketPolicy.document.addStatements(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [new iam.AccountPrincipal(this.account)],
        actions: ['s3:GetObject', 's3:PutObject'],
        resources: [bucket.arnForObjects('*')],
        conditions: {
          'IpAddress': {
            'aws:SourceIp': ['10.0.0.0/16'] // Example IP range
          }
        }
      })
    );

    // Create KMS key with key policy
    const key = new kms.Key(this, 'ResourcePolicyKey', {
      enableKeyRotation: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    key.addToResourcePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [new iam.AccountPrincipal(this.account)],
        actions: ['kms:Decrypt', 'kms:Encrypt'],
        resources: ['*'],
        conditions: {
          'StringEquals': {
            'kms:ViaService': `s3.${this.region}.amazonaws.com`
          }
        }
      })
    );

    // Create SNS topic with topic policy
    const topic = new sns.Topic(this, 'ResourcePolicyTopic');

    topic.addToResourcePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [new iam.AccountPrincipal(this.account)],
        actions: ['sns:Publish'],
        resources: [topic.topicArn],
        conditions: {
          'ArnLike': {
            'aws:SourceArn': bucket.bucketArn
          }
        }
      })
    );

    // Create SQS queue with queue policy
    const queue = new sqs.Queue(this, 'ResourcePolicyQueue');

    queue.addToResourcePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [new iam.ServicePrincipal('sns.amazonaws.com')],
        actions: ['sqs:SendMessage'],
        resources: [queue.queueArn],
        conditions: {
          'ArnEquals': {
            'aws:SourceArn': topic.topicArn
          }
        }
      })
    );

    // Subscribe queue to topic
    new sns.Subscription(this, 'TopicSubscription', {
      topic: topic,
      endpoint: queue.queueArn,
      protocol: sns.SubscriptionProtocol.SQS,
    });

    // Outputs
    new cdk.CfnOutput(this, 'BucketName', {
      value: bucket.bucketName,
    });

    new cdk.CfnOutput(this, 'KeyId', {
      value: key.keyId,
    });

    new cdk.CfnOutput(this, 'TopicArn', {
      value: topic.topicArn,
    });

    new cdk.CfnOutput(this, 'QueueUrl', {
      value: queue.queueUrl,
    });
  }
}
```

### 2. Create Test Scripts

1. Create a script to test S3 bucket policy:

```typescript:scripts/test-bucket-policy.ts
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({});

async function testBucketPolicy() {
  const bucketName = process.env.BUCKET_NAME;
  const testKey = 'test-file.txt';

  try {
    // Test PutObject
    await s3.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: testKey,
      Body: 'Test content',
    }));
    console.log('Successfully uploaded object');

    // Test GetObject
    const response = await s3.send(new GetObjectCommand({
      Bucket: bucketName,
      Key: testKey,
    }));

    const body = await response.Body?.transformToString();
    console.log('Successfully retrieved object:', body);
  } catch (error) {
    console.error('Error testing bucket policy:', error);
  }
}

testBucketPolicy();
```

2. Create a script to test SNS/SQS policies:

```typescript:scripts/test-messaging-policies.ts
import {
  SNSClient,
  PublishCommand
} from '@aws-sdk/client-sns';
import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand
} from '@aws-sdk/client-sqs';

const sns = new SNSClient({});
const sqs = new SQSClient({});

async function testMessagingPolicies() {
  const topicArn = process.env.TOPIC_ARN;
  const queueUrl = process.env.QUEUE_URL;

  try {
    // Publish message to SNS
    await sns.send(new PublishCommand({
      TopicArn: topicArn,
      Message: 'Test message',
    }));
    console.log('Successfully published message');

    // Wait for message to propagate
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Receive message from SQS
    const receiveResponse = await sqs.send(new ReceiveMessageCommand({
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 1,
      WaitTimeSeconds: 5,
    }));

    if (receiveResponse.Messages) {
      console.log('Received message:', receiveResponse.Messages[0].Body);

      // Delete message
      await sqs.send(new DeleteMessageCommand({
        QueueUrl: queueUrl,
        ReceiptHandle: receiveResponse.Messages[0].ReceiptHandle,
      }));
      console.log('Successfully deleted message');
    }
  } catch (error) {
    console.error('Error testing messaging policies:', error);
  }
}

testMessagingPolicies();
```

### 3. Deploy and Test

1. Deploy the stack:

```bash
cdk deploy ResourcePoliciesStack
```

2. Set environment variables:

```bash
export BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name ResourcePoliciesStack \
  --query 'Stacks[0].Outputs[?OutputKey==`BucketName`].OutputValue' \
  --output text \
 )

export TOPIC_ARN=$(aws cloudformation describe-stacks \
  --stack-name ResourcePoliciesStack \
  --query 'Stacks[0].Outputs[?OutputKey==`TopicArn`].OutputValue' \
  --output text \
 )

export QUEUE_URL=$(aws cloudformation describe-stacks \
  --stack-name ResourcePoliciesStack \
  --query 'Stacks[0].Outputs[?OutputKey==`QueueUrl`].OutputValue' \
  --output text \
 )
```

3. Run tests:

```bash
ts-node scripts/test-bucket-policy.ts
ts-node scripts/test-messaging-policies.ts
```

### 4. Cross-Account Setup (Optional)

1. Modify the stack to allow cross-account access:

```typescript:lib/resource-policies-stack.ts
// Add to the bucket policy
bucketPolicy.document.addStatements(
  new iam.PolicyStatement({
    effect: iam.Effect.ALLOW,
    principals: [new iam.AccountPrincipal('ANOTHER_ACCOUNT_ID')],
    actions: ['s3:GetObject'],
    resources: [bucket.arnForObjects('*')]
  })
);
```

2. Test cross-account access using different AWS profiles.

## Validation Steps

After completing this lab, verify that:

1. ✅ Resource policies created successfully
2. ✅ S3 bucket policies working correctly
3. ✅ Lambda resource policies effective
4. ✅ Cross-account access configured
5. ✅ Policy conditions working as expected
6. ✅ Least privilege principle followed

## Troubleshooting

Common issues and solutions:

1. **Policy Issues**

   - Check policy syntax
   - Verify principal formats
   - Review resource ARNs
   - Test policy conditions

2. **Access Issues**

   - Check IAM permissions
   - Verify resource policies
   - Review cross-account trust
   - Test with different principals

3. **Security Issues**
   - Review policy conditions
   - Check for overly broad permissions
   - Verify encryption settings
   - Monitor access patterns

## Cleanup

When you're finished with this lab:

```bash
# Remove test objects from S3 (get bucket name from stack outputs)
export BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name ResourcePoliciesStack \
  --query 'Stacks[0].Outputs[?OutputKey==`BucketName`].OutputValue' \
  --output text \
 )

aws s3 rm s3://$BUCKET_NAME --recursive

# Destroy the CDK stack
cdk destroy ResourcePoliciesStack
```

Note: Ensure all cross-account access is no longer needed before cleanup.
