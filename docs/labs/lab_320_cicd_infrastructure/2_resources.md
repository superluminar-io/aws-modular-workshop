# CICD Infrastructure - Resources

## Official Documentation

### CDK Pipelines

- [CDK Pipelines Overview](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.pipelines-readme.html)
- [CDK Pipelines API Reference](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.pipelines.CodePipeline.html)
- [CDK Pipeline Concepts](https://docs.aws.amazon.com/cdk/v2/guide/cdk_pipeline.html)
- [Self-Mutating Pipelines](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.pipelines-readme.html#self-mutation)

### AWS CodePipeline

- [CodePipeline User Guide](https://docs.aws.amazon.com/codepipeline/latest/userguide/welcome.html)
- [Pipeline Structure Reference](https://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html)
- [Action Types](https://docs.aws.amazon.com/codepipeline/latest/userguide/actions.html)
- [Cross-Account Actions](https://docs.aws.amazon.com/codepipeline/latest/userguide/actions-create-cross-account.html)

### GitHub Integration

- [GitHub Connections](https://docs.aws.amazon.com/dtconsole/latest/userguide/connections-create-github.html)
- [Managing GitHub Connections](https://docs.aws.amazon.com/dtconsole/latest/userguide/connections-update.html)
- [GitHub Authentication](https://docs.aws.amazon.com/codepipeline/latest/userguide/GitHub-authentication.html)
- [GitHub Webhooks](https://docs.aws.amazon.com/codepipeline/latest/userguide/pipelines-webhooks.html)

## Security and Access Control

### IAM Configuration

- [Pipeline IAM Roles](https://docs.aws.amazon.com/codepipeline/latest/userguide/security-iam.html)
- [Cross-Account Role Setup](https://docs.aws.amazon.com/codepipeline/latest/userguide/security_iam_cross-account-setup.html)
- [Service Role Reference](https://docs.aws.amazon.com/codepipeline/latest/userguide/security_iam_service-role-policy-reference.html)
- [IAM Best Practices](https://docs.aws.amazon.com/codepipeline/latest/userguide/security-iam.html#security_iam_service-with-iam-best-practices)

### Security Best Practices

- [Security Best Practices](https://docs.aws.amazon.com/codepipeline/latest/userguide/security-best-practices.html)
- [Encryption Settings](https://docs.aws.amazon.com/codepipeline/latest/userguide/data-encryption.html)
- [Secrets Management](https://docs.aws.amazon.com/secretsmanager/latest/userguide/integrating_how-services-use-secrets_codepipeline.html)
- [VPC Endpoints](https://docs.aws.amazon.com/codepipeline/latest/userguide/vpc-support.html)

## Testing and Validation

### Testing Tools

- [AWS CodeBuild](https://docs.aws.amazon.com/codebuild/latest/userguide/welcome.html)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)
- [CDK Testing Constructs](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.assertions-readme.html)
- [CDK-NAG Security Testing](https://github.com/cdklabs/cdk-nag)

### Pipeline Testing

- [Pipeline Testing Guide](https://docs.aws.amazon.com/codepipeline/latest/userguide/monitoring-tests.html)
- [Test Actions](https://docs.aws.amazon.com/codepipeline/latest/userguide/actions-invoke-lambda-function.html)
- [Integration Testing](https://docs.aws.amazon.com/codepipeline/latest/userguide/actions-create-custom-action.html)
- [Test Reports](https://docs.aws.amazon.com/codebuild/latest/userguide/test-reporting.html)

## Monitoring and Operations

### CloudWatch Integration

- [Pipeline Monitoring](https://docs.aws.amazon.com/codepipeline/latest/userguide/monitoring.html)
- [CloudWatch Events](https://docs.aws.amazon.com/codepipeline/latest/userguide/detect-state-changes-cloudwatch-events.html)
- [Metrics and Dimensions](https://docs.aws.amazon.com/codepipeline/latest/userguide/monitoring-cloudwatch.html)
- [Creating Alarms](https://docs.aws.amazon.com/codepipeline/latest/userguide/monitoring-cloudwatch-events.html)

### Logging and Debugging

- [Pipeline Logs](https://docs.aws.amazon.com/codepipeline/latest/userguide/pipelines-view-logs.html)
- [CloudTrail Logging](https://docs.aws.amazon.com/codepipeline/latest/userguide/monitoring-cloudtrail-logs.html)
- [Troubleshooting Guide](https://docs.aws.amazon.com/codepipeline/latest/userguide/troubleshooting.html)
- [Error Codes](https://docs.aws.amazon.com/codepipeline/latest/userguide/actions-error-details.html)

## AWS CDK Examples and Patterns

### Example Implementations

- [CDK Pipeline Examples](https://github.com/aws-samples/aws-cdk-examples)
- [Multi-Account Pipelines](https://github.com/aws-samples/aws-bootstrap-kit-examples)
- [Pipeline Patterns](https://github.com/cdk-patterns/serverless)
- [AWS Solutions Constructs](https://docs.aws.amazon.com/solutions/latest/constructs/welcome.html)

### Best Practices

- [CDK Best Practices](https://docs.aws.amazon.com/cdk/v2/guide/best-practices.html)
- [Pipeline Architecture](https://docs.aws.amazon.com/prescriptive-guidance/latest/patterns/deploy-code-aws-codepipeline-aws-cdk-pipeline.html)
- [Infrastructure as Code](https://docs.aws.amazon.com/prescriptive-guidance/latest/patterns/deploy-infrastructure-as-code-with-aws-cdk-pipelines.html)
- [Deployment Strategies](https://docs.aws.amazon.com/whitepapers/latest/introduction-devops-aws/deployment-strategies.html)

## Tools and Utilities

### Development Tools

- [AWS CDK CLI](https://docs.aws.amazon.com/cdk/v2/guide/cli.html)
- [AWS CLI CodePipeline](https://docs.aws.amazon.com/cli/latest/reference/codepipeline/index.html)
- [AWS SDK Integration](https://docs.aws.amazon.com/codepipeline/latest/userguide/sdk-examples.html)
- [IDE Extensions](https://aws.amazon.com/tools/)

### Utility Libraries

- [AWS CDK Toolkit](https://github.com/aws/aws-cdk)
- [CDK Aspects](https://docs.aws.amazon.com/cdk/v2/guide/aspects.html)
- [CDK Custom Constructs](https://constructs.dev/search?q=pipeline&offset=0)
- [AWS Solutions Library](https://aws.amazon.com/solutions/)

## Community Resources

### Learning Resources

- [AWS DevOps Blog](https://aws.amazon.com/blogs/devops/)
- [CDK Workshop](https://cdkworkshop.com/)
- [AWS Skill Builder](https://explore.skillbuilder.aws/learn)
- [AWS re:Invent Sessions](https://aws.amazon.com/events/reinvent/)

### Support and Discussion

- [AWS re:Post](https://repost.aws/)
- [GitHub Discussions](https://github.com/aws/aws-cdk/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/aws-cdk)
- [CDK Community](https://cdk.dev/)
