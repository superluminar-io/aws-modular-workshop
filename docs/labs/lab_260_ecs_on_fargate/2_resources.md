# ECS on Fargate - Resources

## Official Documentation

### ECS Core Documentation

- [Amazon ECS User Guide](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html)
- [AWS Fargate User Guide](https://docs.aws.amazon.com/AmazonECS/latest/userguide/what-is-fargate.html)
- [ECS Best Practices](https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/intro.html)
- [ECS CLI Documentation](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ECS_CLI.html)

### Task Definitions and Services

- [Task Definition Parameters](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html)
- [Service Definition Parameters](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service_definition_parameters.html)
- [Fargate Task Definitions](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html)
- [Service Load Balancing](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-load-balancing.html)

## Container Management

### Task Management

- [Running Tasks on Fargate](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html)
- [Task Placement Strategies](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-placement-strategies.html)
- [Task Networking](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-networking.html)
- [Using Data Volumes](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_data_volumes.html)

### Service Management

- [Service Scheduler Concepts](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs_services.html)
- [Service Auto Scaling](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-auto-scaling.html)
- [Blue/Green Deployments](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-types.html)
- [Service Discovery](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-discovery.html)

## Networking and Security

### Network Configuration

- [VPC Configuration](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-networking.html)
- [Security Groups](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/security-groups.html)
- [Load Balancer Types](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-load-balancing.html)
- [Private Registry Auth](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/private-auth.html)

### Security Best Practices

- [IAM Roles for Tasks](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html)
- [Secrets Management](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data.html)
- [Security Best Practices](https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/security.html)
- [Logging and Monitoring](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/logging-monitoring.html)

## Monitoring and Logging

### CloudWatch Integration

- [Container Insights](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/ContainerInsights.html)
- [CloudWatch Logs Configuration](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_cloudwatch_logs.html)
- [Metrics and Dimensions](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cloudwatch-metrics.html)
- [Alarms and Events](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cloudwatch-alarms.html)

### Observability Tools

- [AWS X-Ray Integration](https://docs.aws.amazon.com/xray/latest/devguide/xray-services-ecs.html)
- [FireLens Log Router](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_firelens.html)
- [AWS Distro for OpenTelemetry](https://aws.amazon.com/otel/)
- [Container Health Checks](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definition_parameters.html#container_definition_healthcheck)

## AWS CDK and ECS

### CDK Documentation

- [ECS Module in CDK](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs-readme.html)
- [ECS Patterns Module](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs_patterns-readme.html)
- [Fargate Service Construct](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs.FargateService.html)
- [CDK ECS Examples](https://github.com/aws-samples/aws-cdk-examples/tree/master/typescript/ecs)

## Tools and Utilities

### Development Tools

- [AWS Copilot CLI](https://aws.github.io/copilot-cli/)
- [ECS CLI](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ECS_CLI.html)
- [AWS App Runner](https://aws.amazon.com/apprunner/)
- [Docker Compose ECS Integration](https://docs.docker.com/cloud/ecs-integration/)

### Troubleshooting Tools

- [ECS Exec](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-exec.html)
- [Task Metadata Endpoint](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-metadata-endpoint.html)
- [Service Connect Debug](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-connect-debug.html)
- [Common Troubleshooting Issues](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/troubleshooting.html)

## Cost Optimization

### Pricing and Cost Management

- [Fargate Pricing](https://aws.amazon.com/fargate/pricing/)
- [Capacity Providers](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cluster-capacity-providers.html)
- [Fargate Spot](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-capacity-providers.html)
- [Cost Optimization Guide](https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/cost-optimization.html)

## Community Resources

### Blogs and Articles

- [AWS Containers Blog](https://aws.amazon.com/blogs/containers/)
- [ECS Workshop](https://ecsworkshop.com/)
- [AWS GitHub Repositories](https://github.com/aws-samples?q=ecs&type=all&language=&sort=)
- [AWS re:Post ECS Forum](https://repost.aws/tags/TAF8-XUqojTsadH5jSz3IfFg/amazon-elastic-container-service-ecs)

### Additional Learning

- [ECS Deep Dive Series](https://aws.amazon.com/blogs/containers/category/compute/amazon-ecs/)
- [AWS Skill Builder - ECS Courses](https://skillbuilder.aws/learning-plans/containers)
- [AWS Solutions Library - Containers](https://aws.amazon.com/solutions/?solutions-all.sort-by=item.additionalFields.sortDate&solutions-all.sort-order=desc&awsf.AWS-Product%20Category=tech-category%23containers)
- [Container Security Best Practices](https://aws.amazon.com/blogs/containers/guidance-for-container-image-security-in-amazon-elastic-container-registry/)
