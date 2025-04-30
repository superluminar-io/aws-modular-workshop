# SNS and SQS - Resources

## Official Documentation

### SNS Documentation

- [SNS Developer Guide](https://docs.aws.amazon.com/sns/latest/dg/welcome.html)
- [SNS API Reference](https://docs.aws.amazon.com/sns/latest/api/welcome.html)
- [SNS Best Practices](https://docs.aws.amazon.com/sns/latest/dg/sns-best-practices.html)
- [Message Filtering](https://docs.aws.amazon.com/sns/latest/dg/sns-message-filtering.html)

### SQS Documentation

- [SQS Developer Guide](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html)
- [SQS API Reference](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/Welcome.html)
- [FIFO Queues](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues.html)
- [Dead-Letter Queues](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html)

## Message Management

### Message Operations

- [Publishing Messages](https://docs.aws.amazon.com/sns/latest/dg/sns-publishing.html)
- [Receiving Messages](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-getting-started.html)
- [Message Attributes](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-message-attributes.html)
- [Batch Operations](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-batch-api-actions.html)

### Message Processing

- [Long Polling](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-short-and-long-polling.html)
- [Visibility Timeout](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html)
- [Message Retention](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-message-retention.html)
- [Message Deduplication](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues-exactly-once-processing.html)

## Security and Access Control

### Authentication and Authorization

- [SNS Access Control](https://docs.aws.amazon.com/sns/latest/dg/sns-authentication-and-access-control.html)
- [SQS Access Control](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-authentication-and-access-control.html)
- [IAM Policies](https://docs.aws.amazon.com/sns/latest/dg/sns-using-identity-based-policies.html)
- [Resource-Based Policies](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-creating-custom-policies.html)

### Security Features

- [Encryption at Rest](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-server-side-encryption.html)
- [VPC Endpoints](https://docs.aws.amazon.com/sns/latest/dg/sns-vpc-endpoints.html)
- [Private Endpoints](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-vpc-endpoints.html)
- [Compliance](https://docs.aws.amazon.com/sns/latest/dg/sns-security.html)

## Monitoring and Operations

### CloudWatch Integration

- [SNS Metrics](https://docs.aws.amazon.com/sns/latest/dg/sns-monitoring-using-cloudwatch.html)
- [SQS Metrics](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-monitoring-using-cloudwatch.html)
- [Alarm Configuration](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-monitoring-using-cloudwatch.html)
- [Logging](https://docs.aws.amazon.com/sns/latest/dg/sns-logging-using-cloudtrail.html)

### Troubleshooting

- [SNS Troubleshooting](https://docs.aws.amazon.com/sns/latest/dg/sns-troubleshooting.html)
- [SQS Troubleshooting](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-troubleshooting.html)
- [Common Issues](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-limits.html)
- [Best Practices](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-best-practices.html)

## AWS CDK Resources

### CDK Documentation

- [SNS Construct Library](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_sns-readme.html)
- [SQS Construct Library](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_sqs-readme.html)
- [SNS Subscriptions](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_sns_subscriptions-readme.html)
- [CDK Examples](https://github.com/aws-samples/aws-cdk-examples)

### Example Implementations

- [Messaging Patterns](https://github.com/aws-samples/aws-cdk-examples/tree/master/typescript/sns-sqs-messages)
- [Event Processing](https://github.com/aws-samples/aws-cdk-examples/tree/master/typescript/eventbridge-sns-sqs)
- [Fanout Pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/patterns/implement-serverless-fanout-pattern-with-amazon-sns-and-amazon-sqs-using-aws-cdk.html)
- [Dead Letter Queues](https://docs.aws.amazon.com/prescriptive-guidance/latest/patterns/handle-failed-messages-in-a-dead-letter-queue-with-amazon-sqs-and-aws-lambda.html)

## Tools and Utilities

### Development Tools

- [AWS CLI SNS](https://docs.aws.amazon.com/cli/latest/reference/sns/index.html)
- [AWS CLI SQS](https://docs.aws.amazon.com/cli/latest/reference/sqs/index.html)
- [AWS SDK Examples](https://github.com/awsdocs/aws-doc-sdk-examples)
- [CloudFormation Resources](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/AWS_SNS.html)

### Testing Tools

- [AWS SAM Local](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-using-invoke.html)
- [LocalStack](https://github.com/localstack/localstack)
- [Queue Management Tools](https://aws.amazon.com/tools/)
- [Message Generators](https://github.com/aws-samples/amazon-sqs-message-generator)

## Best Practices and Patterns

### Architecture Patterns

- [Event-Driven Architecture](https://aws.amazon.com/event-driven-architecture/)
- [Messaging Patterns](https://aws.amazon.com/blogs/compute/messaging-patterns-for-event-driven-architectures/)
- [Integration Patterns](https://aws.amazon.com/blogs/compute/understanding-asynchronous-messaging-for-microservices/)
- [Scalability Patterns](https://aws.amazon.com/blogs/compute/building-scalable-applications-with-amazon-sqs-and-amazon-sns/)

### Performance Optimization

- [SQS Performance](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-best-practices.html)
- [SNS Performance](https://docs.aws.amazon.com/sns/latest/dg/sns-best-practices.html)
- [Cost Optimization](https://aws.amazon.com/blogs/architecture/cost-optimization-patterns-for-amazon-sns-and-amazon-sqs/)
- [Scaling Considerations](https://aws.amazon.com/blogs/compute/understanding-how-amazon-sqs-scales/)

## Community Resources

### Learning Resources

- [AWS Messaging Workshop](https://catalog.workshops.aws/building-messaging-architectures)
- [AWS Compute Blog](https://aws.amazon.com/blogs/compute/)
- [AWS Architecture Blog](https://aws.amazon.com/blogs/architecture/)
- [AWS re:Invent Sessions](https://aws.amazon.com/events/reinvent/)

### Support and Forums

- [AWS re:Post SNS](https://repost.aws/tags/TAF8-XUqojTsadH5jSz3IfFg/amazon-simple-notification-service-amazon-sns)
- [AWS re:Post SQS](https://repost.aws/tags/TAF8-XUqojTsadH5jSz3IfFg/amazon-simple-queue-service-sqs)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/amazon-sqs)
- [GitHub Issues](https://github.com/aws/aws-cdk/issues)
