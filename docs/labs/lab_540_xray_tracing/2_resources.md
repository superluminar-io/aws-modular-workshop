# AWS X-Ray - Resources

## Official Documentation

### Core Documentation

- [AWS X-Ray Developer Guide](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html)
- [X-Ray API Reference](https://docs.aws.amazon.com/xray/latest/api/Welcome.html)
- [X-Ray Concepts](https://docs.aws.amazon.com/xray/latest/devguide/xray-concepts.html)
- [X-Ray SDK Documentation](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk.html)

### Getting Started

- [Getting Started with X-Ray](https://docs.aws.amazon.com/xray/latest/devguide/xray-gettingstarted.html)
- [X-Ray Daemon Configuration](https://docs.aws.amazon.com/xray/latest/devguide/xray-daemon-configuration.html)
- [Sampling Rules](https://docs.aws.amazon.com/xray/latest/devguide/xray-console-sampling.html)
- [Service Map](https://docs.aws.amazon.com/xray/latest/devguide/xray-console.html#xray-console-servicemap)

## Language-Specific SDKs

### Node.js

- [X-Ray SDK for Node.js](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-nodejs.html)
- [Node.js Middleware](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-nodejs-middleware.html)
- [Node.js Sample Applications](https://github.com/aws-samples/aws-xray-sdk-node)
- [Express.js Integration](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-nodejs-express.html)

### Other Languages

- [Java SDK](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-java.html)
- [Python SDK](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-python.html)
- [.NET SDK](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-dotnet.html)
- [Go SDK](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-go.html)

## AWS Service Integration

### Lambda Integration

- [Lambda and X-Ray](https://docs.aws.amazon.com/lambda/latest/dg/services-xray.html)
- [Lambda Tracing Configuration](https://docs.aws.amazon.com/lambda/latest/dg/lambda-x-ray.html)
- [Lambda Sample Applications](https://github.com/aws-samples/aws-lambda-sample-applications)

### API Gateway

- [API Gateway and X-Ray](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-xray.html)
- [Tracing API Gateway Requests](https://docs.aws.amazon.com/xray/latest/devguide/xray-services-apigateway.html)
- [API Gateway Stage Configuration](https://docs.aws.amazon.com/apigateway/latest/developerguide/stage-variables.html)

### Container Services

- [ECS and X-Ray](https://docs.aws.amazon.com/xray/latest/devguide/xray-daemon-ecs.html)
- [EKS and X-Ray](https://docs.aws.amazon.com/xray/latest/devguide/xray-daemon-eks.html)
- [App Mesh Integration](https://docs.aws.amazon.com/app-mesh/latest/userguide/envoy-xray.html)

## AWS CDK Integration

### CDK Constructs

- [X-Ray CDK Module](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_xray-readme.html)
- [Lambda Tracing](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_lambda-readme.html#tracing)
- [API Gateway Tracing](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_apigateway-readme.html#tracing)

### CDK Examples

- [AWS CDK Examples](https://github.com/aws-samples/aws-cdk-examples)
- [X-Ray Patterns](https://docs.aws.amazon.com/prescriptive-guidance/latest/patterns/trace-aws-lambda-functions-using-aws-x-ray-and-aws-cdk.html)

## Security and Access Control

### IAM Configuration

- [X-Ray IAM Policies](https://docs.aws.amazon.com/xray/latest/devguide/security_iam_service-with-iam.html)
- [IAM Role Configuration](https://docs.aws.amazon.com/xray/latest/devguide/security_iam_id-based-policy-examples.html)
- [Cross-Account Access](https://docs.aws.amazon.com/xray/latest/devguide/xray-cross-account.html)

### Security Best Practices

- [Security Best Practices](https://docs.aws.amazon.com/xray/latest/devguide/security-best-practices.html)
- [Encryption Configuration](https://docs.aws.amazon.com/xray/latest/devguide/xray-console-encryption.html)
- [VPC Configuration](https://docs.aws.amazon.com/xray/latest/devguide/xray-daemon-vpc.html)

## Monitoring and Analysis

### Trace Analysis

- [Using the X-Ray Console](https://docs.aws.amazon.com/xray/latest/devguide/xray-console.html)
- [Analyzing Trace Data](https://docs.aws.amazon.com/xray/latest/devguide/xray-console-analytics.html)
- [Insights and Analytics](https://docs.aws.amazon.com/xray/latest/devguide/xray-console-insights.html)

### CloudWatch Integration

- [CloudWatch Metrics](https://docs.aws.amazon.com/xray/latest/devguide/xray-metrics.html)
- [CloudWatch Alarms](https://docs.aws.amazon.com/xray/latest/devguide/xray-console-alerts.html)
- [CloudWatch Dashboards](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/add_xray_widget_dashboard.html)

## Tools and Utilities

### AWS CLI Commands

- [X-Ray CLI Reference](https://docs.aws.amazon.com/cli/latest/reference/xray/index.html)
- [Sampling Rules CLI](https://docs.aws.amazon.com/cli/latest/reference/xray/create-sampling-rule.html)
- [Trace Analysis CLI](https://docs.aws.amazon.com/cli/latest/reference/xray/get-trace-summaries.html)

### Development Tools

- [AWS X-Ray Daemon](https://docs.aws.amazon.com/xray/latest/devguide/xray-daemon.html)
- [X-Ray SDK GitHub Repositories](https://github.com/aws/aws-xray-sdk)
- [Testing Tools](https://docs.aws.amazon.com/xray/latest/devguide/xray-sdk-nodejs-testing.html)

## Best Practices and Patterns

### Implementation Patterns

- [Instrumentation Best Practices](https://docs.aws.amazon.com/xray/latest/devguide/xray-best-practices.html)
- [Sampling Strategies](https://docs.aws.amazon.com/xray/latest/devguide/xray-console-sampling.html#xray-console-sampling-strategies)
- [Performance Optimization](https://docs.aws.amazon.com/xray/latest/devguide/xray-api-optimization.html)

### Cost Management

- [Pricing Overview](https://aws.amazon.com/xray/pricing/)
- [Cost Optimization](https://docs.aws.amazon.com/xray/latest/devguide/xray-cost-optimization.html)
- [Usage Monitoring](https://docs.aws.amazon.com/xray/latest/devguide/xray-usage.html)

## Tutorials and Workshops

- [X-Ray Workshop](https://www.workshops.aws/card/AWS-X-Ray)
- [Serverless Observability Workshop](https://catalog.workshops.aws/observability/en-US)
- [Microservices Workshop](https://catalog.workshops.aws/microservices/en-US)
- [ECS Workshop](https://ecsworkshop.com/monitoring/container-insights/)

## Community Resources

- [AWS Compute Blog](https://aws.amazon.com/blogs/compute/)
- [AWS Developer Blog](https://aws.amazon.com/blogs/developer/)
- [AWS re:Post - X-Ray](https://repost.aws/tags/TAmo05QHWFYw7VhKYGNRbrdg/aws-x-ray)
- [GitHub Samples](https://github.com/aws-samples?q=xray&type=all&language=&sort=)
