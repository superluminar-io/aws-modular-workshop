# CICD for Containers - Resources

## Official Documentation

### Container Build and Deploy

- [AWS CodeBuild User Guide](https://docs.aws.amazon.com/codebuild/latest/userguide/welcome.html)
- [Building Docker Images](https://docs.aws.amazon.com/codebuild/latest/userguide/sample-docker.html)
- [ECS Deployment Actions](https://docs.aws.amazon.com/codepipeline/latest/userguide/action-reference-ECS.html)
- [ECR Push Commands](https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html)

### Pipeline Configuration

- [CodePipeline User Guide](https://docs.aws.amazon.com/codepipeline/latest/userguide/welcome.html)
- [Pipeline Structure Reference](https://docs.aws.amazon.com/codepipeline/latest/userguide/reference-pipeline-structure.html)
- [GitHub Integration](https://docs.aws.amazon.com/codepipeline/latest/userguide/GitHub-authentication.html)
- [ECS Blue/Green Deployments](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-type-bluegreen.html)

## Container Security

### Image Security

- [Container Image Security Guide](https://docs.aws.amazon.com/prescriptive-guidance/latest/patterns/welcome.html)
- [ECR Image Scanning](https://docs.aws.amazon.com/AmazonECR/latest/userguide/image-scanning.html)
- [AWS Security Hub Container Insights](https://docs.aws.amazon.com/securityhub/latest/userguide/securityhub-standards-fsbp-controls.html)
- [Docker Security Best Practices](https://docs.docker.com/develop/security-best-practices/)

### Access Control

- [ECR IAM Policies](https://docs.aws.amazon.com/AmazonECR/latest/userguide/security_iam_service-with-iam.html)
- [ECS Task IAM Roles](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html)
- [Secrets Management](https://docs.aws.amazon.com/secretsmanager/latest/userguide/integrating_how-services-use-secrets_codebuild.html)
- [VPC Endpoints](https://docs.aws.amazon.com/AmazonECR/latest/userguide/vpc-endpoints.html)

## Testing and Validation

### Container Testing

- [CodeBuild Testing Framework](https://docs.aws.amazon.com/codebuild/latest/userguide/test-reporting.html)
- [Integration Testing](https://docs.aws.amazon.com/codepipeline/latest/userguide/actions-invoke-lambda-function.html)
- [Container Health Checks](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html#container_definition_healthcheck)
- [Load Testing Containers](https://docs.aws.amazon.com/prescriptive-guidance/latest/load-testing/welcome.html)

### Monitoring Tools

- [Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html)
- [ECS Logging](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_cloudwatch_logs.html)
- [X-Ray Container Tracing](https://docs.aws.amazon.com/xray/latest/devguide/xray-daemon-ecs.html)
- [CloudWatch Metrics](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cloudwatch-metrics.html)

## AWS CDK Resources

### CDK Constructs

- [ECR Constructs](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecr-readme.html)
- [CodeBuild Constructs](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_codebuild-readme.html)
- [CodePipeline Constructs](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_codepipeline-readme.html)
- [ECS Constructs](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs-readme.html)

### Example Implementations

- [Container Pipeline Examples](https://github.com/aws-samples/aws-cdk-examples)
- [ECS Deployment Patterns](https://catalog.workshops.aws/ecs/en-US)
- [Blue/Green Deployments](https://github.com/aws-samples/aws-cdk-examples)
- [Custom Constructs](https://constructs.dev/search?q=container&offset=0)

## Tools and Utilities

### Development Tools

- [Docker CLI](https://docs.docker.com/engine/reference/commandline/cli/)
- [AWS CLI ECS Commands](https://docs.aws.amazon.com/cli/latest/reference/ecs/index.html)
- [AWS Copilot CLI](https://aws.github.io/copilot-cli/)
- [Container Tools](https://aws.amazon.com/tools/)

### Testing and Security

- [Snyk Container](https://snyk.io/product/container-vulnerability-management/)
- [Clair Scanner](https://github.com/quay/clair)
- [Docker Scan](https://docs.docker.com/engine/scan/)
- [Trivy](https://github.com/aquasecurity/trivy)

## Best Practices

### Container Optimization

- [Docker Build Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [ECS Task Sizing](https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/capacity-tasksize.html)
- [Image Optimization](https://docs.aws.amazon.com/prescriptive-guidance/latest/patterns/welcome.html)
- [Cost Optimization](https://aws.amazon.com/blogs/containers/

### Deployment Strategies

- [ECS Deployment Options](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-types.html)
- [CI/CD Best Practices](https://docs.aws.amazon.com/prescriptive-guidance/latest/patterns/set-up-ci-cd-for-amazon-ecs-applications.html)
- [Pipeline Architecture](https://docs.aws.amazon.com/prescriptive-guidance/latest/patterns/deploy-containers-with-aws-codepipeline.html)
- [Automated Rollbacks](https://docs.aws.amazon.com/codedeploy/latest/userguide/deployment-groups-configure-advanced-options.html)

## Community Resources

### Learning Resources

- [AWS Containers Blog](https://aws.amazon.com/blogs/containers/
- [ECS Workshop](https://ecsworkshop.com/)
- [Container Security Learning](https://aws.amazon.com/security/security-learning/)
- [AWS Skill Builder - Containers](https://skillbuilder.aws/learning-plans/containers)

### Support and Forums

- [AWS re:Post Containers](https://repost.aws/)
- [Docker Forums](https://forums.docker.com/)
- [Stack Overflow - ECS](https://stackoverflow.com/questions/tagged/amazon-ecs)
- [GitHub AWS Containers](https://github.com/aws/containers-roadmap)
