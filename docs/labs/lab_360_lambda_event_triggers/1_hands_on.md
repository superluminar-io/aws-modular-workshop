# Lambda Event Triggers - Hands-on Lab

[DIAGRAM: Lambda Hands-on Architecture]
Description: A detailed diagram showing the Lambda resources we'll create in this lab. The diagram should:

1. Show the complete architecture:
   - Lambda Functions
   - Event Sources
   - IAM Roles
   - VPC Configuration
   - CloudWatch Integration
2. Illustrate the relationships between components
3. Show the event patterns
4. Include example service integrations
   Use AWS's standard color scheme with blue for AWS services and green for Lambda components.

## Prerequisites

- AWS CDK and AWS CLI configured
- Node.js installed
- Basic TypeScript knowledge

## Lab Steps

### 1. Create Lambda Infrastructure

Create a new file `lib/lambda-stack.ts`:

```typescript:lib/lambda-stack.ts
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';

export class LambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create S3 Bucket
    const bucket = new s3.Bucket(this, 'TriggerBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Create DynamoDB Table
    const table = new dynamodb.Table(this, 'ItemsTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
    });

    // Create Dead Letter Queue
    const dlq = new sqs.Queue(this, 'DeadLetterQueue', {
      retentionPeriod: cdk.Duration.days(14),
    });

    // Create S3 Event Handler
    const s3Handler = new lambda.Function(this, 'S3EventHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('src/s3-handler'),
      environment: {
        TABLE_NAME: table.tableName,
      },
      deadLetterQueue: dlq,
      deadLetterQueueEnabled: true,
    });

    // Create DynamoDB Stream Handler
    const streamHandler = new lambda.Function(this, 'StreamHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('src/stream-handler'),
      deadLetterQueue: dlq,
      deadLetterQueueEnabled: true,
    });

    // Create Scheduled Handler
    const scheduledHandler = new lambda.Function(this, 'ScheduledHandler', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('src/scheduled-handler'),
      deadLetterQueue: dlq,
      deadLetterQueueEnabled: true,
    });

    // Grant permissions
    bucket.grantRead(s3Handler);
    table.grantWriteData(s3Handler);
    table.grantStreamRead(streamHandler);

    // Add event triggers
    bucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new s3.LambdaDestination(s3Handler)
    );

    streamHandler.addEventSourceMapping('StreamHandlerMapping', {
      eventSourceArn: table.tableStreamArn!,
      startingPosition: lambda.StartingPosition.LATEST,
      batchSize: 1,
      retryAttempts: 3,
    });

    // Add EventBridge schedule
    new events.Rule(this, 'ScheduleRule', {
      schedule: events.Schedule.rate(cdk.Duration.minutes(5)),
      targets: [new targets.LambdaFunction(scheduledHandler)],
    });

    // Outputs
    new cdk.CfnOutput(this, 'BucketName', {
      value: bucket.bucketName,
    });

    new cdk.CfnOutput(this, 'TableName', {
      value: table.tableName,
    });

    new cdk.CfnOutput(this, 'DLQUrl', {
      value: dlq.queueUrl,
    });
  }
}
```

### 2. Create Lambda Function Handlers

1. Create S3 event handler:

```typescript:src/s3-handler/index.ts
import { S3Event } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const ddbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddbClient);

export const handler = async (event: S3Event): Promise<void> => {
  try {
    for (const record of event.Records) {
      const item = {
        id: record.s3.object.key,
        bucket: record.s3.bucket.name,
        size: record.s3.object.size,
        timestamp: new Date().toISOString(),
      };

      await docClient.send(new PutCommand({
        TableName: process.env.TABLE_NAME,
        Item: item,
      }));

      console.log(`Processed S3 event for object: ${item.id}`);
    }
  } catch (error) {
    console.error('Error processing S3 event:', error);
    throw error;
  }
};
```

2. Create DynamoDB Stream handler:

```typescript:src/stream-handler/index.ts
import { DynamoDBStreamEvent } from 'aws-lambda';

export const handler = async (event: DynamoDBStreamEvent): Promise<void> => {
  try {
    for (const record of event.Records) {
      console.log('Stream record:', {
        eventName: record.eventName,
        oldImage: record.dynamodb?.OldImage,
        newImage: record.dynamodb?.NewImage,
      });
    }
  } catch (error) {
    console.error('Error processing stream event:', error);
    throw error;
  }
};
```

3. Create scheduled handler:

```typescript:src/scheduled-handler/index.ts
import { ScheduledEvent } from 'aws-lambda';

export const handler = async (event: ScheduledEvent): Promise<void> => {
  try {
    console.log('Scheduled event triggered at:', event.time);
    // Add your scheduled task logic here
  } catch (error) {
    console.error('Error processing scheduled event:', error);
    throw error;
  }
};
```

### 3. Deploy and Test

1. Deploy the stack:

```bash
cdk deploy LambdaStack --profile your-profile-name
```

2. Test S3 trigger:

```bash
# Upload file to S3
aws s3 cp test.txt s3://your-bucket-name/ \
  --profile your-profile-name
```

3. Monitor DynamoDB Stream:

```bash
# Check CloudWatch logs
aws logs get-log-events \
  --log-group-name /aws/lambda/StreamHandler \
  --log-stream-name $(aws logs describe-log-streams \
    --log-group-name /aws/lambda/StreamHandler \
    --order-by LastEventTime \
    --descending \
    --limit 1 \
    --query 'logStreams[0].logStreamName' \
    --output text) \
  --profile your-profile-name
```

4. Check scheduled executions:

```bash
aws logs get-log-events \
  --log-group-name /aws/lambda/ScheduledHandler \
  --log-stream-name latest \
  --profile your-profile-name
```

## Validation Steps

1. Function Deployment

   - [ ] All functions deployed successfully
   - [ ] IAM roles configured correctly
   - [ ] Environment variables set
   - [ ] DLQ configured

2. Event Triggers

   - [ ] S3 events triggering function
   - [ ] DynamoDB Stream processing
   - [ ] Schedule executing on time
   - [ ] Events logged correctly

3. Error Handling
   - [ ] DLQ catching failed events
   - [ ] Retries working
   - [ ] Error logging working
   - [ ] Monitoring configured

## Troubleshooting

1. Function Issues

   - Check CloudWatch logs
   - Verify IAM permissions
   - Check environment variables
   - Review function timeout

2. Event Trigger Issues

   - Verify event source mapping
   - Check trigger configuration
   - Review event structure
   - Check service quotas

3. Permission Issues
   - Review IAM roles
   - Check resource policies
   - Verify VPC configuration
   - Check encryption settings

## Cleanup

Remove the stack:

```bash
cdk destroy LambdaStack --profile your-profile-name
```
