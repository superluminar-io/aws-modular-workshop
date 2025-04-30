# EventBridge - Hands-on Lab

## Prerequisites

- AWS CDK and AWS CLI configured
- Node.js installed
- Completed SNS and SQS lab

[DIAGRAM: EventBridge Implementation]
Instructions for draw.io:

1. Create a new diagram using the AWS Architecture 2023 template
2. Use the following AWS symbols from the symbol pack:
   - AWS EventBridge icon
   - AWS Lambda icon
   - AWS SNS icon
   - AWS SQS icon
   - AWS CloudWatch icon
   - AWS IAM icon
3. Layout:
   - Place EventBridge at the center
   - Add event sources on the left
   - Place targets (Lambda, SNS, SQS) on the right
   - Add CloudWatch monitoring at the bottom
   - Show IAM roles and policies on the right
4. Use AWS's standard connector arrows to show event flow
5. Add event rule visualization with filters
6. Use AWS's standard color scheme:
   - Blue for AWS services
   - Green for event components
   - Gray for infrastructure elements

## Lab Steps

### 1. Create EventBridge Infrastructure

Create a new file `lib/eventbridge-stack.ts`:

```typescript:lib/eventbridge-stack.ts
import * as cdk from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import { Construct } from 'constructs';

export class EventBridgeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create Custom Event Bus
    const customBus = new events.EventBus(this, 'CustomEventBus', {
      eventBusName: 'workshop-bus',
    });

    // Create Dead Letter Queue
    const dlq = new sqs.Queue(this, 'DeadLetterQueue', {
      retentionPeriod: cdk.Duration.days(14),
    });

    // Create SNS Topic for notifications
    const notificationTopic = new sns.Topic(this, 'NotificationTopic');

    // Create Lambda function to process events
    const processorFunction = new lambda.Function(this, 'ProcessorFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('src/processor'),
      environment: {
        TOPIC_ARN: notificationTopic.topicArn,
      },
    });

    // Grant permissions
    notificationTopic.grantPublish(processorFunction);

    // Create Rules
    new events.Rule(this, 'HighPriorityRule', {
      eventBus: customBus,
      ruleName: 'high-priority-events',
      description: 'Rule for high priority events',
      eventPattern: {
        source: ['workshop.events'],
        detailType: ['transaction'],
        detail: {
          priority: ['high'],
        },
      },
      targets: [new targets.LambdaFunction(processorFunction, {
        deadLetterQueue: dlq,
        maxEventAge: cdk.Duration.hours(2),
        retryAttempts: 2,
      })],
    });

    new events.Rule(this, 'AllEventsRule', {
      eventBus: customBus,
      ruleName: 'all-events-logging',
      description: 'Rule for logging all events',
      eventPattern: {
        source: ['workshop.events'],
      },
      targets: [new targets.SqsQueue(dlq)],
    });

    // Archive events
    new events.Archive(this, 'EventArchive', {
      sourceEventBus: customBus,
      archiveName: 'workshop-archive',
      description: 'Archive for workshop events',
      retention: cdk.Duration.days(30),
      eventPattern: {
        source: ['workshop.events'],
      },
    });

    // Outputs
    new cdk.CfnOutput(this, 'EventBusName', {
      value: customBus.eventBusName,
    });

    new cdk.CfnOutput(this, 'EventBusArn', {
      value: customBus.eventBusArn,
    });

    new cdk.CfnOutput(this, 'DlqUrl', {
      value: dlq.queueUrl,
    });

    new cdk.CfnOutput(this, 'TopicArn', {
      value: notificationTopic.topicArn,
    });
  }
}
```

### 2. Create Event Processor

Create a new file `src/processor/index.ts`:

```typescript:src/processor/index.ts
import { EventBridgeEvent } from 'aws-lambda';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

const sns = new SNSClient({});

export const handler = async (event: EventBridgeEvent<string, any>): Promise<void> => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  try {
    // Process the event based on type
    if (event['detail-type'] === 'transaction') {
      await processTransaction(event);
    }

    // Send notification
    await sns.send(new PublishCommand({
      TopicArn: process.env.TOPIC_ARN,
      Message: JSON.stringify({
        eventId: event.id,
        processedAt: new Date().toISOString(),
        detail: event.detail,
      }),
      MessageAttributes: {
        eventType: {
          DataType: 'String',
          StringValue: event['detail-type'],
        },
      },
    }));

  } catch (error) {
    console.error('Error processing event:', error);
    throw error;
  }
};

async function processTransaction(event: EventBridgeEvent<string, any>): Promise<void> {
  // Add your transaction processing logic here
  console.log('Processing transaction:', event.detail);
}
```

### 3. Deploy and Test

1. Deploy the stack:

```bash
cdk deploy EventBridgeStack --profile your-profile-name
```

2. Create a test script `scripts/send-events.ts`:

```typescript:scripts/send-events.ts
import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';

const eventbridge = new EventBridgeClient({});

async function sendTestEvents() {
  const eventBusName = process.env.EVENT_BUS_NAME;

  const events = [
    {
      Source: 'workshop.events',
      DetailType: 'transaction',
      Detail: JSON.stringify({
        transactionId: '123',
        amount: 100,
        priority: 'high',
        timestamp: new Date().toISOString(),
      }),
    },
    {
      Source: 'workshop.events',
      DetailType: 'transaction',
      Detail: JSON.stringify({
        transactionId: '456',
        amount: 50,
        priority: 'low',
        timestamp: new Date().toISOString(),
      }),
    },
  ];

  try {
    const result = await eventbridge.send(new PutEventsCommand({
      Entries: events.map(event => ({
        ...event,
        EventBusName: eventBusName,
      })),
    }));

    console.log('Events sent:', result);
  } catch (error) {
    console.error('Error sending events:', error);
  }
}

sendTestEvents();
```

3. Run the test script:

```bash
export EVENT_BUS_NAME=$(aws cloudformation describe-stacks \
  --stack-name EventBridgeStack \
  --query 'Stacks[0].Outputs[?OutputKey==`EventBusName`].OutputValue' \
  --output text \
  --profile your-profile-name)

ts-node scripts/send-events.ts
```

### 4. Monitor Events

1. Check Lambda logs:

```bash
aws logs get-log-events \
  --log-group-name /aws/lambda/ProcessorFunction \
  --log-stream-name $(aws logs describe-log-streams \
    --log-group-name /aws/lambda/ProcessorFunction \
    --order-by LastEventTime \
    --descending \
    --limit 1 \
    --query 'logStreams[0].logStreamName' \
    --output text) \
  --profile your-profile-name
```

2. Check DLQ:

[DIAGRAM: EventBridge Monitoring]
Instructions for draw.io:

1. Create a new diagram using the AWS Architecture 2023 template
2. Use the following AWS symbols from the symbol pack:
   - AWS EventBridge icon
   - AWS CloudWatch icon
   - AWS Lambda icon
   - AWS SNS icon
   - AWS IAM icon
3. Layout:
   - Create a flowchart using AWS's standard flowchart shapes
   - Use diamond shapes for decision points
   - Use AWS's standard connector arrows
4. Add process boxes for:
   - Event Monitoring
   - Log Analysis
   - Alert Handling
   - Archive Management
5. Use AWS's standard color scheme for all elements
6. Add clear labels for each monitoring step

## Validation Steps

1. Infrastructure Setup

   - [ ] Event bus created
   - [ ] Rules configured
   - [ ] Lambda function deployed
   - [ ] DLQ set up

2. Event Processing

   - [ ] Events being sent
   - [ ] Rules matching
   - [ ] Lambda processing
   - [ ] Notifications working

3. Monitoring
   - [ ] CloudWatch logs available
   - [ ] Events archived
   - [ ] DLQ capturing failures
   - [ ] Metrics visible

## Troubleshooting

1. Event Delivery

   - Check event bus metrics
   - Verify rule patterns
   - Review target permissions
   - Check CloudWatch logs

2. Processing Issues

   - Check Lambda logs
   - Verify IAM roles
   - Review DLQ messages
   - Check SNS delivery

3. Performance
   - Monitor invocation metrics
   - Check throttling
   - Review error rates
   - Verify timeouts

## Cleanup

Remove the stack:

```bash
cdk destroy EventBridgeStack --profile your-profile-name
```
