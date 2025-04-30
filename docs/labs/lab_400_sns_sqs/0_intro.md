# SNS and SQS with AWS CDK

## Overview

Amazon Simple Notification Service (SNS) and Amazon Simple Queue Service (SQS) are fully managed messaging services that enable you to decouple and scale microservices, distributed systems, and serverless applications. In this lab, you'll learn how to create and manage messaging systems using SNS and SQS with AWS CDK.

[DIAGRAM: Messaging Overview]
Instructions for draw.io:

1. Create a new diagram using the AWS Architecture 2023 template
2. Use the following AWS symbols from the symbol pack:
   - AWS SNS icon
   - AWS SQS icon
   - AWS Lambda icon
   - AWS CloudWatch icon
   - AWS IAM icon
3. Layout:
   - Place SNS topics at the center
   - Add SQS queues on the left
   - Place subscribers on the right
   - Show DLQ connections below
4. Use AWS's standard connector arrows to show message flow
5. Add clear labels for each component
6. Use AWS's standard color scheme:
   - Blue for AWS services
   - Green for messaging components
   - Gray for infrastructure elements

## Learning Objectives

- Understand SNS and SQS core concepts
- Create and configure SNS topics and subscriptions
- Set up SQS queues with different configurations
- Implement message filtering
- Handle dead-letter queues
- Monitor messaging patterns
- Implement best practices for messaging

## Core Concepts

### SNS Architecture

1. **Topic Structure**

   ```
   ┌─────────────────────┐
   │     SNS Topic      │
   │                     │
   │  ┌───────────────┐  │
   │  │  Publishers   │  │
   │  └───────────────┘  │
   │         │           │
   │         ▼           │
   │  ┌───────────────┐  │
   │  │ Subscribers   │  │
   │  └───────────────┘  │
   └─────────────────────┘
   ```

   - Topics
   - Publishers
   - Subscribers
   - Message filtering

2. **Message Flow**
   ```
   Publisher → Topic → Message Filter → Subscribers
      │         │           │             │
      └─────────┴───────────┴─────────────┘
              Message Attributes
   ```

### SQS Components

1. **Queue Types**

   ```
   Standard Queue           FIFO Queue
   ┌──────────┐           ┌──────────┐
   │ At-least │           │ Exactly  │
   │  once    │           │  once    │
   └──────────┘           └──────────┘
        │                      │
        │     ┌──────────┐    │
        └────▶│Messages  │◀───┘
              └──────────┘
   ```

   - Standard queues
   - FIFO queues
   - Message attributes
   - Visibility timeout

2. **Queue Processing**
   ```
   Producer → Queue → Consumer
                │
                ▼
         Dead Letter Queue
   ```
   - Message retention
   - Delivery delays
   - Redrive policies
   - Batch operations

### Integration Patterns

1. **Fanout Pattern**

   ```
   SNS Topic
      │
      ├─────► SQS Queue 1
      │
      ├─────► SQS Queue 2
      │
      └─────► SQS Queue 3
   ```

   - Message distribution
   - Parallel processing
   - Workload isolation
   - Error handling

2. **Message Filtering**
   ```
   Message         Filter Policy     Subscriber
   ┌────────┐     ┌──────────┐     ┌─────────┐
   │Attrs   │────▶│Condition │────▶│Queue/   │
   └────────┘     └──────────┘     │Endpoint │
                                   └─────────┘
   ```
   - Attribute-based
   - Policy conditions
   - Subscription filters
   - Message routing

### Monitoring and Operations

1. **CloudWatch Integration**

   ```
   Metrics        Alarms         Actions
   ┌────────┐    ┌────────┐    ┌────────┐
   │Queue   │───▶│Threshold│───▶│Notify  │
   │Metrics │    │Breach   │    │Scale   │
   └────────┘    └────────┘    └────────┘
   ```

   - Queue metrics
   - Topic metrics
   - Alarm configuration
   - Operational insights

2. **Dead Letter Queues**
   ```
   Source Queue    Max Receives    DLQ
   ┌──────────┐    ┌─────────┐    ┌──────────┐
   │Messages  │───▶│Exceeded │───▶│Failed    │
   └──────────┘    └─────────┘    │Messages  │
                                  └──────────┘
   ```
   - Failed message handling
   - Retry policies
   - Message investigation
   - Reprocessing strategies

## Best Practices

1. **Message Design**

   - Message structure
   - Attribute usage
   - Size limitations
   - Versioning

2. **Security**

   - Access policies
   - Encryption
   - Authentication
   - Authorization

3. **Performance**

   - Batch processing
   - Concurrent processing
   - Timeout configuration
   - Scaling considerations

4. **Reliability**
   - Error handling
   - Dead-letter queues
   - Retry strategies
   - Monitoring

## Prerequisites for Lab

- AWS CDK installed
- AWS CLI configured
- Basic understanding of messaging patterns
- Node.js installed

## What's Next

In the hands-on section, you'll:

- Create SNS topics
- Configure SQS queues
- Implement message filtering
- Set up dead-letter queues
- Monitor message flow
- Test different messaging patterns

[DIAGRAM: Messaging Flow]
Instructions for draw.io:

1. Create a new diagram using the AWS Architecture 2023 template
2. Use the following AWS symbols from the symbol pack:
   - AWS SNS icon
   - AWS SQS icon
   - AWS Lambda icon
   - AWS CloudWatch icon
3. Layout:
   - Create a flowchart using AWS's standard flowchart shapes
   - Use diamond shapes for decision points
   - Use AWS's standard connector arrows
4. Add process boxes for:
   - Message Publishing
   - Message Delivery
   - Message Processing
   - Error Handling
5. Use AWS's standard color scheme for all elements
6. Add clear labels for each step in the flow
