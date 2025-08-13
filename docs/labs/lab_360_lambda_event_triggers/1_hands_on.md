# Lambda Event Triggers - Hands-on Lab

## Prerequisites

> Tip: Set an AWS profile for this shell to avoid repeating profile flags

```bash
export AWS_PROFILE=your-profile-name
```

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
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sources from 'aws-cdk-lib/aws-lambda-event-sources';
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
      runtime: lambda.Runtime.NODEJS_22_X,
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
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('src/stream-handler'),
      deadLetterQueue: dlq,
      deadLetterQueueEnabled: true,
    });

    // Create Scheduled Handler
    const scheduledHandler = new lambda.Function(this, 'ScheduledHandler', {
      runtime: lambda.Runtime.NODEJS_22_X,
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
      new s3n.LambdaDestination(s3Handler)
    );

    streamHandler.addEventSource(new sources.DynamoEventSource(table, {
      startingPosition: lambda.StartingPosition.LATEST,
      batchSize: 1,
      retryAttempts: 3,
    }));

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

    new cdk.CfnOutput(this, 'S3HandlerName', { value: s3Handler.functionName });
    new cdk.CfnOutput(this, 'StreamHandlerName', { value: streamHandler.functionName });
    new cdk.CfnOutput(this, 'ScheduledHandlerName', { value: scheduledHandler.functionName });
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
cdk deploy LambdaStack
```

2. Test S3 trigger:

First, get the bucket name from the CDK stack outputs:

```bash
# Get bucket name from stack outputs
export BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name LambdaStack \
  --query 'Stacks[0].Outputs[?OutputKey==`BucketName`].OutputValue' \
  --output text \
 )

echo "Bucket name: $BUCKET_NAME"
```

```bash
# Upload file to S3
aws s3 cp test.txt s3://$BUCKET_NAME/ \

```

3. Monitor DynamoDB Stream:

```bash
# Fetch function name from stack outputs and stream recent logs
export STREAM_FN=$(aws cloudformation describe-stacks \
  --stack-name LambdaStack \
  --query "Stacks[0].Outputs[?OutputKey=='StreamHandlerName'].OutputValue" \
  --output text)

aws logs tail "/aws/lambda/$STREAM_FN" --since 10m --follow
```

4. Check scheduled executions:

```bash
export SCHEDULED_FN=$(aws cloudformation describe-stacks \
  --stack-name LambdaStack \
  --query "Stacks[0].Outputs[?OutputKey=='ScheduledHandlerName'].OutputValue" \
  --output text)

aws logs tail "/aws/lambda/$SCHEDULED_FN" --since 10m --follow
```

## Validation Steps

After completing this lab, verify that:

1. ✅ Lambda functions created successfully
2. ✅ S3 event triggers working
3. ✅ DynamoDB table updating correctly
4. ✅ CloudWatch logs available
5. ✅ Error handling working
6. ✅ Event filtering working correctly

## Troubleshooting

Common issues and solutions:

1. **Lambda Function Issues**

   - Check CloudWatch logs
   - Verify runtime version
   - Check environment variables
   - Review IAM permissions

2. **S3 Event Issues**

   - Verify event configuration
   - Check S3 bucket notifications
   - Ensure Lambda permissions
   - Test with sample files

3. **DynamoDB Issues**
   - Check table exists
   - Verify write permissions
   - Monitor capacity units
   - Check item format

## Cleanup

When you're finished with this lab:

```bash
# Empty S3 bucket
aws s3 rm s3://$BUCKET_NAME --recursive

# Get table name and remove all items from DynamoDB table (optional)
export TABLE_NAME=$(aws cloudformation describe-stacks \
  --stack-name LambdaStack \
  --query 'Stacks[0].Outputs[?OutputKey==`TableName`].OutputValue' \
  --output text \
 )

aws dynamodb scan --table-name $TABLE_NAME | \
  jq -r '.Items[].id.S' | \
  while read id; do
    aws dynamodb delete-item \
      --table-name $TABLE_NAME \
      --key "{\"id\":{\"S\":\"$id\"}}" \

  done

# Destroy the CDK stack
cdk destroy LambdaStack
```
