# AWS CloudTrail Audit - Hands-on Lab

## Prerequisites

- AWS CDK and AWS CLI configured
- Basic understanding of AWS services
- Completed IAM lab

[DIAGRAM: CloudTrail Implementation]
Instructions for draw.io:

1. Create a new diagram using the AWS Architecture 2023 template
2. Use the following AWS symbols from the symbol pack:
   - AWS CloudTrail icon
   - AWS S3 icon
   - AWS KMS icon
   - AWS CloudWatch icon
   - AWS EventBridge icon
   - AWS SNS icon
3. Layout:
   - Place CloudTrail at the center
   - Add S3 bucket and KMS key on the left
   - Place CloudWatch Logs and EventBridge on the right
   - Show SNS notifications at the bottom
4. Use AWS's standard connector arrows to show relationships
5. Add audit flow visualization with events
6. Use AWS's standard color scheme:
   - Blue for AWS services
   - Green for CloudTrail components
   - Gray for infrastructure elements

## Lab Steps

### 1. Create CloudTrail Infrastructure

Create a new file `lib/cloudtrail-stack.ts`:

```typescript:lib/cloudtrail-stack.ts
import * as cdk from 'aws-cdk-lib';
import * as cloudtrail from 'aws-cdk-lib/aws-cloudtrail';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { Construct } from 'constructs';

export class CloudTrailStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create KMS key for CloudTrail encryption
    const trailKey = new kms.Key(this, 'TrailKey', {
      enableKeyRotation: true,
      description: 'KMS key for CloudTrail logs encryption',
    });

    // Create S3 bucket for CloudTrail logs
    const trailBucket = new s3.Bucket(this, 'TrailBucket', {
      encryption: s3.BucketEncryption.KMS,
      encryptionKey: trailKey,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      enforceSSL: true,
    });

    // Create CloudWatch Log Group for CloudTrail
    const trailLogGroup = new logs.LogGroup(this, 'TrailLogGroup', {
      retention: logs.RetentionDays.ONE_MONTH,
      encryptionKey: trailKey,
    });

    // Create SNS topic for CloudTrail notifications
    const trailTopic = new sns.Topic(this, 'TrailTopic', {
      masterKey: trailKey,
    });

    trailTopic.addSubscription(
      new subscriptions.EmailSubscription('your-email@example.com')
    );

    // Create CloudTrail trail
    const trail = new cloudtrail.Trail(this, 'AuditTrail', {
      bucket: trailBucket,
      encryptionKey: trailKey,
      enableFileValidation: true,
      includeGlobalServiceEvents: true,
      isMultiRegionTrail: true,
      cloudWatchLogGroup: trailLogGroup,
      sendToCloudWatchLogs: true,
      sns: trailTopic,
    });

    // Add data event logging for S3 and Lambda
    trail.addEventSelector(cloudtrail.DataResourceType.S3_OBJECT, [
      'arn:aws:s3:::',
    ]);

    trail.addEventSelector(cloudtrail.DataResourceType.LAMBDA_FUNCTION, [
      'arn:aws:lambda',
    ]);

    // Create CloudTrail Lake event data store
    const lakeStore = new cloudtrail.CfnEventDataStore(this, 'LakeStore', {
      name: 'audit-lake-store',
      multiRegionEnabled: true,
      organizationEnabled: false,
      retentionPeriod: 30,
      terminationProtectionEnabled: true,
    });

    // Create EventBridge rule for suspicious activity
    const suspiciousActivityRule = new events.Rule(this, 'SuspiciousActivityRule', {
      description: 'Monitor for suspicious API activity',
      eventPattern: {
        detail: {
          eventSource: ['iam.amazonaws.com'],
          eventName: [
            'DeleteUserPolicy',
            'DeleteRolePolicy',
            'DeleteGroupPolicy',
            'PutUserPolicy',
            'PutRolePolicy',
            'PutGroupPolicy',
            'CreateAccessKey',
            'DeleteAccessKey',
          ],
        },
      },
    });

    suspiciousActivityRule.addTarget(new targets.SnsTopic(trailTopic));

    // Outputs
    new cdk.CfnOutput(this, 'TrailArn', {
      value: trail.trailArn,
    });

    new cdk.CfnOutput(this, 'LogGroupName', {
      value: trailLogGroup.logGroupName,
    });

    new cdk.CfnOutput(this, 'BucketName', {
      value: trailBucket.bucketName,
    });

    new cdk.CfnOutput(this, 'TopicArn', {
      value: trailTopic.topicArn,
    });

    new cdk.CfnOutput(this, 'LakeStoreArn', {
      value: lakeStore.attrEventDataStoreArn,
    });
  }
}
```

### 2. Create Analysis Scripts

1. Create a script to analyze CloudTrail logs:

```typescript:scripts/analyze-trail-logs.ts
import {
  CloudTrailClient,
  LookupEventsCommand,
  Event
} from '@aws-sdk/client-cloudtrail';

const cloudtrail = new CloudTrailClient({});

async function analyzeTrailLogs() {
  try {
    const response = await cloudtrail.send(new LookupEventsCommand({
      StartTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
      LookupAttributes: [
        {
          AttributeKey: 'EventName',
          AttributeValue: 'ConsoleLogin',
        },
      ],
    }));

    console.log('Recent console login events:');
    response.Events?.forEach((event: Event) => {
      console.log(`
        Time: ${event.EventTime}
        User: ${event.Username}
        Event: ${event.EventName}
        Source: ${event.EventSource}
        Region: ${event.AwsRegion}
      `);
    });
  } catch (error) {
    console.error('Error analyzing CloudTrail logs:', error);
  }
}

analyzeTrailLogs();
```

2. Create a script to query CloudTrail Lake:

```typescript:scripts/query-lake.ts
import {
  CloudTrailClient,
  StartQueryCommand,
  GetQueryResultsCommand
} from '@aws-sdk/client-cloudtrail';

const cloudtrail = new CloudTrailClient({});

async function queryLake() {
  const eventDataStore = process.env.LAKE_STORE_ARN;

  try {
    // Start query
    const startQueryResponse = await cloudtrail.send(new StartQueryCommand({
      QueryStatement: `
        SELECT eventTime, eventName, userIdentity.userName,
               sourceIPAddress, eventSource
        FROM ${eventDataStore}
        WHERE eventName LIKE '%Policy%'
        AND eventTime >= dateadd('hour', -24, current_timestamp)
      `,
    }));

    const queryId = startQueryResponse.QueryId;
    console.log('Query started:', queryId);

    // Wait for results
    let results;
    do {
      await new Promise(resolve => setTimeout(resolve, 2000));
      results = await cloudtrail.send(new GetQueryResultsCommand({
        QueryId: queryId,
      }));
    } while (results.QueryStatus === 'RUNNING');

    console.log('Query results:');
    results.Results?.forEach(row => {
      const rowData = row.reduce((acc: any, col) => {
        if (col.Column && col.Value) {
          acc[col.Column] = col.Value;
        }
        return acc;
      }, {});
      console.log(rowData);
    });
  } catch (error) {
    console.error('Error querying CloudTrail Lake:', error);
  }
}

queryLake();
```

### 3. Deploy and Test

1. Deploy the stack:

```bash
cdk deploy CloudTrailStack --profile your-profile-name
```

2. Set environment variables:

```bash
export LAKE_STORE_ARN=$(aws cloudformation describe-stacks \
  --stack-name CloudTrailStack \
  --query 'Stacks[0].Outputs[?OutputKey==`LakeStoreArn`].OutputValue' \
  --output text \
  --profile your-profile-name)

[DIAGRAM: CloudTrail Testing]
Instructions for draw.io:
1. Create a new diagram using the AWS Architecture 2023 template
2. Use the following AWS symbols from the symbol pack:
   - AWS CloudTrail icon
   - AWS CloudWatch icon
   - AWS S3 icon
   - AWS EventBridge icon
3. Layout:
   - Create a flowchart using AWS's standard flowchart shapes
   - Use diamond shapes for decision points
   - Use AWS's standard connector arrows
4. Add process boxes for:
   - Event Logging
   - Log Analysis
   - Lake Queries
   - Alert Monitoring
5. Use AWS's standard color scheme for all elements
```
