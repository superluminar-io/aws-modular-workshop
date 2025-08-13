# EventBridge

## Overview

Amazon EventBridge is a serverless event bus service that makes it easy to connect applications together using data from your own applications, integrated Software-as-a-Service (SaaS) applications, and AWS services. This lab demonstrates how to use EventBridge to build event-driven architectures.

[DIAGRAM: EventBridge Overview]

<!-- Removed placeholder: diagram defined below -->

```mermaid
flowchart LR
    subgraph "Event Sources"
        APP[Custom Applications]
        SAAS[SaaS Applications]
        AWS[AWS Services]
        CRON[Scheduled Events]
    end

    subgraph "EventBridge Central Hub"
        subgraph "Event Buses"
            DEFAULT[Default Event Bus]
            CUSTOM[Custom Event Bus]
            PARTNER[Partner Event Bus]
        end

        subgraph "Event Processing"
            RULES[Event Rules<br/>Pattern Matching]
            FILTER[Event Filtering]
            TRANSFORM[Data Transformation]
        end

        subgraph "Event Routing"
            ROUTER[Event Router]
            DLQ[Dead Letter Queue]
            RETRY[Retry Logic]
        end
    end

    subgraph "Event Targets"
        LAMBDA[Lambda Functions]
        SQS[SQS Queues]
        SNS[SNS Topics]
        KINESIS[Kinesis Streams]
        SF[Step Functions]
        PIPES[EventBridge Pipes]
    end

    subgraph "Cross-Account & Region"
        XACCOUNT[Cross-Account<br/>Event Sharing]
        XREGION[Cross-Region<br/>Replication]
        ARCHIVE[Event Archive<br/>& Replay]
    end

    subgraph "Monitoring & Observability"
        CW[CloudWatch<br/>Metrics & Logs]
        INSIGHTS[EventBridge<br/>Insights]
        XRAY[X-Ray Tracing]
    end

    %% Event Flow
    APP --> DEFAULT
    SAAS --> PARTNER
    AWS --> DEFAULT
    CRON --> CUSTOM

    DEFAULT --> RULES
    CUSTOM --> RULES
    PARTNER --> RULES

    RULES --> FILTER
    FILTER --> TRANSFORM
    TRANSFORM --> ROUTER

    ROUTER --> LAMBDA
    ROUTER --> SQS
    ROUTER --> SNS
    ROUTER --> KINESIS
    ROUTER --> SF
    ROUTER --> PIPES

    %% Error Handling
    ROUTER -.->|Failed| DLQ
    DLQ -.->|Retry| RETRY

    %% Cross-boundary
    ROUTER --> XACCOUNT
    ROUTER --> XREGION
    ROUTER --> ARCHIVE

    %% Monitoring
    RULES --> CW
    ROUTER --> INSIGHTS
    LAMBDA --> XRAY

    %% Styling
    classDef aws fill:#ff9900,stroke:#232F3E,stroke-width:2px,color:#232F3E
    classDef eventbus fill:#569a31,stroke:#232F3E,stroke-width:2px,color:white
    classDef processing fill:#4B9CD3,stroke:#232F3E,stroke-width:2px,color:white
    classDef targets fill:#8C4FFF,stroke:#232F3E,stroke-width:2px,color:white

    class APP,SAAS,AWS,CRON,LAMBDA,SQS,SNS,KINESIS,SF,PIPES,CW,INSIGHTS,XRAY aws
    class DEFAULT,CUSTOM,PARTNER eventbus
    class RULES,FILTER,TRANSFORM,ROUTER,RETRY processing
    class XACCOUNT,XREGION,ARCHIVE,DLQ targets
```

<!-- End diagram section -->

## Learning Objectives

- Understand EventBridge concepts and components
- Create and manage event buses
- Define event patterns and rules
- Configure event targets
- Implement event filtering
- Monitor and debug event flows
- Apply best practices for event-driven architectures

## Core Concepts

### EventBridge Architecture

1. **Event Bus Components**

   ```
   ┌─────────────┐     ┌─────────────┐    ┌─────────────┐
   │   Event     │     │    Event    │    │   Event     │
   │  Sources    │────▶│    Bus      │───▶│  Targets    │
   └─────────────┘     └─────────────┘    └─────────────┘
         │                    │                  │
         │             ┌──────┴──────┐           │
         └────────────▶│    Rules    │◀──────────┘
                       └─────────────┘
   ```

   - Event buses
   - Event sources
   - Event targets
   - Rules and patterns

2. **Event Structure**
   ```json
   {
     "version": "0",
     "id": "event-id",
     "detail-type": "type",
     "source": "source",
     "account": "account",
     "time": "timestamp",
     "region": "region",
     "detail": {
       "key": "value"
     }
   }
   ```

### Event Rules and Patterns

1. **Rule Components**

   ```
   Rule
   ├── Event Pattern
   │   ├── Source
   │   ├── Detail Type
   │   └── Detail
   └── Targets
       ├── Primary Target
       └── Dead Letter Queue
   ```

   - Pattern matching
   - Content filtering
   - Target configuration
   - Error handling

2. **Pattern Types**
   ```
   ┌────────────────┐
   │ Event Patterns │
   │  ┌─────────┐   │
   │  │ Prefix  │   │
   │  │ Match   │   │
   │  └─────────┘   │
   │  ┌─────────┐   │
   │  │ Exact   │   │
   │  │ Match   │   │
   │  └─────────┘   │
   └────────────────┘
   ```
   - Prefix matching
   - Exact matching
   - Pattern arrays
   - Nested patterns

### Event Targets

1. **Target Types**

   ```
   EventBridge Rule
         │
         ├─────► Lambda Functions
         │
         ├─────► SQS Queues
         │
         ├─────► SNS Topics
         │
         ├─────► Step Functions
         │
         └─────► API Destinations
   ```

   - AWS services
   - API destinations
   - Event buses
   - Third-party services

2. **Target Configuration**
   - Input transformation
   - Retry policies
   - Dead-letter queues
   - Permissions

### Monitoring and Debugging

1. **CloudWatch Integration**

   ```
   Events        Metrics       Alarms
   ┌────────┐   ┌────────┐   ┌─────────┐
   │Archive │   │Invoked │   │Failure  │
   │Replay  │──▶│Success │──▶│Threshold│
   └────────┘   │Failed  │   └─────────┘
                └────────┘
   ```

   - Event archiving
   - Event replay
   - Metrics and logs
   - Alarm configuration

2. **Troubleshooting Tools**
   - Event patterns tester
   - CloudWatch logs
   - API tracking
   - Error handling

## Best Practices

1. **Event Design**

   - Schema definition
   - Versioning strategy
   - Content structure
   - Metadata usage

2. **Security**

   - Resource policies
   - IAM roles
   - Event encryption
   - Access control

3. **Performance**

   - Rule optimization
   - Target selection
   - Retry configuration
   - Throughput management

4. **Operations**
   - Monitoring setup
   - Logging strategy
   - Error handling
   - Disaster recovery

## Prerequisites for Lab

- AWS CDK installed
- AWS CLI configured
- Basic understanding of event-driven architecture
- Completed SNS and SQS lab

## What's Next

In the hands-on section, you'll:

- Create event buses
- Configure event rules
- Set up event targets
- Implement event patterns
- Monitor event flows
- Test event delivery

[DIAGRAM: EventBridge Processing Flow]

```mermaid
flowchart TD
    EVENT[Event Generated] --> BUS[Event Bus]
    BUS --> MATCH{Pattern Match}
    MATCH -->|Match Found| RULE[Apply Rule]
    MATCH -->|No Match| DROP[Drop Event]

    RULE --> TRANSFORM{Transform Input?}
    TRANSFORM -->|Yes| MAP[Input Mapping]
    TRANSFORM -->|No| TARGET[Invoke Target]
    MAP --> TARGET

    TARGET --> SUCCESS{Target Success?}
    SUCCESS -->|Yes| ARCHIVE[Archive Event]
    SUCCESS -->|No| RETRY{Retry Policy}

    RETRY -->|Attempts Left| TARGET
    RETRY -->|Max Retries| DLQ[Dead Letter Queue]

    ARCHIVE --> MONITOR[CloudWatch Metrics]
    DLQ --> MONITOR

    style EVENT fill:#569a31,color:#fff
    style ARCHIVE fill:#569a31,color:#fff
    style DROP fill:#dd344c,color:#fff
    style DLQ fill:#dd344c,color:#fff
    style MATCH fill:#ff9900,color:#fff
```
