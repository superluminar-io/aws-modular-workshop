# EventBridge - Hands-on Lab

## Prerequisites

- AWS CDK and AWS CLI configured
- Node.js installed
- Completed SNS and SQS lab

## Lab Overview

This lab demonstrates building event-driven architectures using Amazon EventBridge. You'll create custom event buses, rules, and integrate with various AWS services for event routing and processing.

[DIAGRAM: EventBridge Flow]

```mermaid
flowchart TD
    subgraph Sources["Event Sources"]
        APP[Application Events]
        S3[S3 Events]
        CUSTOM[Custom Events]
    end

    subgraph EventBridge["EventBridge"]
        BUS[Custom Event Bus]
        RULES[Event Rules]
        PATTERN[Event Patterns]
    end

    subgraph Targets["Event Targets"]
        LAMBDA[Lambda Functions]
        SNS[SNS Topics]
        SQS[SQS Queues]
        STEP[Step Functions]
    end

    subgraph Monitoring["Monitoring"]
        CW[CloudWatch Logs]
        METRICS[CloudWatch Metrics]
    end

    APP --> BUS
    S3 --> BUS
    CUSTOM --> BUS

    BUS --> RULES
    RULES --> PATTERN

    PATTERN --> LAMBDA
    PATTERN --> SNS
    PATTERN --> SQS
    PATTERN --> STEP

    BUS --> CW
    RULES --> METRICS
```

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

## EventBridge Implementation

<!-- 🔄 TEMPORARY MERMAID DIAGRAM - REPLACE WITH MANUAL DRAW.IO: lab_420_eventbridge_event_bus_implementation.drawio.svg -->

```mermaid
flowchart TB
    subgraph "Event Producer Applications"
        ORDER[Order Service]
        INVENTORY[Inventory Service]
        PAYMENT[Payment Service]
        SHIPPING[Shipping Service]
    end

    subgraph "EventBridge Event Bus Architecture"
        subgraph "Custom Event Bus"
            BUS[E-Commerce Event Bus]
        end

        subgraph "Event Rules & Patterns"
            RULE1[Order Created Rule<br/>source: order.service<br/>detail-type: Order Created]
            RULE2[Payment Processed Rule<br/>source: payment.service<br/>detail-type: Payment Success]
            RULE3[Inventory Updated Rule<br/>source: inventory.service<br/>detail-type: Stock Changed]
            RULE4[Shipping Rule<br/>source: shipping.service<br/>detail-type: Package Shipped]
        end

        subgraph "Event Filtering & Transformation"
            FILTER1[High Value Orders<br/>amount > 1000]
            FILTER2[Low Stock Alert<br/>quantity < 10]
            FILTER3[Priority Shipping<br/>method = express]
            TRANSFORM[Event Enrichment<br/>Add Customer Data]
        end
    end

    subgraph "Event Consumers & Actions"
        subgraph "Lambda Functions"
            FRAUD[Fraud Detection<br/>Lambda]
            NOTIFY[Customer Notification<br/>Lambda]
            ANALYTICS[Analytics Processor<br/>Lambda]
            RESTOCK[Auto Restock<br/>Lambda]
        end

        subgraph "External Systems"
            EMAIL[Email Service<br/>SES]
            SMS[SMS Service<br/>SNS]
            WEBHOOK[External Webhook<br/>API Gateway]
            WAREHOUSE[Warehouse System<br/>SQS]
        end

        subgraph "Data Storage"
            DYNAMO[(DynamoDB<br/>Event Store)]
            S3[(S3 Bucket<br/>Event Archive)]
            KINESIS[Kinesis Stream<br/>Real-time Analytics]
        end
    end

    %% Event Flow
    ORDER --> BUS
    INVENTORY --> BUS
    PAYMENT --> BUS
    SHIPPING --> BUS

    BUS --> RULE1
    BUS --> RULE2
    BUS --> RULE3
    BUS --> RULE4

    RULE1 --> FILTER1
    RULE2 --> TRANSFORM
    RULE3 --> FILTER2
    RULE4 --> FILTER3

    FILTER1 --> FRAUD
    TRANSFORM --> NOTIFY
    FILTER2 --> RESTOCK
    FILTER3 --> WAREHOUSE

    FRAUD --> EMAIL
    NOTIFY --> SMS
    ANALYTICS --> KINESIS
    RESTOCK --> WAREHOUSE

    %% Data Persistence
    BUS -.-> DYNAMO
    BUS -.-> S3
    KINESIS --> ANALYTICS

    %% Styling
    classDef producer fill:#ff9900,stroke:#232F3E,stroke-width:2px,color:#232F3E
    classDef eventbus fill:#569a31,stroke:#232F3E,stroke-width:2px,color:white
    classDef rules fill:#4B9CD3,stroke:#232F3E,stroke-width:2px,color:white
    classDef consumer fill:#8C4FFF,stroke:#232F3E,stroke-width:2px,color:white
    classDef storage fill:#FF6B6B,stroke:#232F3E,stroke-width:2px,color:white

    class ORDER,INVENTORY,PAYMENT,SHIPPING producer
    class BUS eventbus
    class RULE1,RULE2,RULE3,RULE4,FILTER1,FILTER2,FILTER3,TRANSFORM rules
    class FRAUD,NOTIFY,ANALYTICS,RESTOCK,EMAIL,SMS,WEBHOOK,WAREHOUSE consumer
    class DYNAMO,S3,KINESIS storage
```

<!-- 🔄 END TEMPORARY DIAGRAM -->

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

[DIAGRAM: EventBridge Monitoring Flow]

```mermaid
flowchart TD
    EVENTS[Events Generated] --> METRICS[CloudWatch Metrics]
    EVENTS --> LOGS[CloudWatch Logs]

    METRICS --> DASHBOARD[Dashboard Views]
    METRICS --> ALARMS{Alarm Thresholds}

    ALARMS -->|Threshold Exceeded| ALERT[Send Alert]
    ALARMS -->|Normal| MONITOR[Continue Monitoring]

    LOGS --> INSIGHTS[Log Insights Queries]
    INSIGHTS --> ANALYSIS[Error Analysis]

    ANALYSIS --> RULES{Rule Issues?}
    RULES -->|Pattern Problems| FIX_PATTERN[Fix Event Patterns]
    RULES -->|Target Issues| FIX_TARGET[Fix Target Config]
    RULES -->|No Issues| ARCHIVE[Archive Analysis]

    FIX_PATTERN --> TEST[Test Rules]
    FIX_TARGET --> TEST
    TEST --> MONITOR

    style EVENTS fill:#569a31,color:#fff
    style ALERT fill:#dd344c,color:#fff
    style ARCHIVE fill:#569a31,color:#fff
    style ALARMS fill:#ff9900,color:#fff
```

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
