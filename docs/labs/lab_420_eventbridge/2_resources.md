# EventBridge - Resources

## Official Documentation

### Core Documentation

- [EventBridge User Guide](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-what-is.html)
- [EventBridge API Reference](https://docs.aws.amazon.com/eventbridge/latest/APIReference/Welcome.html)
- [EventBridge CLI Reference](https://docs.aws.amazon.com/cli/latest/reference/events/index.html)
- [Event Patterns](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-patterns.html)

### Event Management

- [Creating Event Buses](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-create-event-bus.html)
- [Working with Rules](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-rules.html)
- [Event Archiving](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-archive-event.html)
- [Event Replay](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-replay-archived-event.html)

## Event Configuration

### Event Structure

- [Event Format](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-events.html)
- [Content-Based Filtering](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-patterns-content-based-filtering.html)
- [Event Pattern Examples](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pattern-examples.html)
- [Schema Registry](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-schema.html)

### Target Configuration

- [Target Types](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-targets.html)
- [Input Transformation](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-transform-target-input.html)
- [Retry Policies](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-rule-dlq.html)
- [Dead-Letter Queues](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-rule-dlq.html)

## Security and Access Control

### Authentication and Authorization

- [IAM Policies](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-use-identity-based.html)
- [Resource-Based Policies](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-use-resource-based.html)
- [Cross-Account Events](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-cross-account.html)
- [Security Best Practices](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-security.html)

### Security Features

- [Encryption](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-encryption.html)
- [VPC Endpoints](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-related-service-vpc.html)
- [Logging and Monitoring](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-logging-monitoring.html)
- [Compliance](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-compliance.html)

## Monitoring and Operations

### CloudWatch Integration

- [Metrics and Dimensions](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-monitoring.html)
- [Creating Alarms](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-monitoring-cloudwatch.html)
- [Logging with CloudTrail](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-logging-monitoring.html)
- [Operational Best Practices](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-best-practices.html)

### Troubleshooting

- [Common Issues](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-troubleshooting.html)
- [Rule Debugging](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-troubleshooting-rules.html)
- [Target Troubleshooting](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-troubleshooting-targets.html)
- [Event Pattern Testing](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-test-event-pattern.html)

## AWS CDK Resources

### CDK Documentation

- [EventBridge Construct Library](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_events-readme.html)
- [EventBridge Targets](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_events_targets-readme.html)
- [CDK Examples](https://github.com/aws-samples/aws-cdk-examples/tree/master/typescript/eventbridge)
- [CDK Patterns](https://cdkpatterns.com/patterns/)

### Example Implementations

- [Event-Driven Patterns](https://github.com/aws-samples/serverless-patterns/tree/main/eventbridge-patterns)
- [Cross-Account Events](https://docs.aws.amazon.com/prescriptive-guidance/latest/patterns/send-events-across-aws-accounts-using-amazon-eventbridge.html)
- [Serverless Architectures](https://serverlessland.com/patterns?service=eventbridge)
- [AWS Solutions Constructs](https://docs.aws.amazon.com/solutions/latest/constructs/welcome.html)

## Tools and Utilities

### Development Tools

- [EventBridge Console](https://console.aws.amazon.com/events/)
- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
- [EventBridge Schema Registry](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-schema-registry.html)
- [Event Pattern Tester](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-test-event-pattern.html)

### Testing and Debugging

- [Local Testing](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-using-invoke.html)
- [Event Generator](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-test-events.html)
- [CloudWatch Logs Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html)
- [AWS X-Ray Integration](https://docs.aws.amazon.com/xray/latest/devguide/xray-services-eventbridge.html)

## Best Practices and Patterns

### Architecture Patterns

- [Event-Driven Design](https://aws.amazon.com/event-driven-architecture/)
- [Serverless Patterns](https://serverlessland.com/patterns)
- [Integration Patterns](https://aws.amazon.com/blogs/compute/integrating-amazon-eventbridge-into-your-serverless-applications/)
- [Microservices Patterns](https://aws.amazon.com/blogs/compute/building-microservices-with-amazon-eventbridge/)

### Performance Optimization

- [Event Bus Design](https://aws.amazon.com/blogs/compute/designing-event-driven-architectures-using-amazon-eventbridge/)
- [Rule Optimization](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-rules.html)
- [Target Selection](https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-targets.html)
- [Cost Optimization](https://aws.amazon.com/blogs/architecture/cost-optimization-patterns-for-amazon-eventbridge/)

## Community Resources

### Learning Resources

- [AWS Compute Blog](https://aws.amazon.com/blogs/compute/)
- [EventBridge Workshop](https://catalog.workshops.aws/eventbridge/en-US)
- [AWS Online Tech Talks](https://aws.amazon.com/events/online-tech-talks/)
- [AWS re:Invent Sessions](https://www.youtube.com/results?search_query=aws+reinvent+eventbridge)

### Support and Forums

- [AWS re:Post EventBridge](https://repost.aws/tags/TAF8-XUqojTsadH5jSz3IfFg/amazon-eventbridge)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/amazon-eventbridge)
- [GitHub Issues](https://github.com/aws/aws-cdk/issues)
- [AWS Developer Forums](https://forums.aws.amazon.com/)
