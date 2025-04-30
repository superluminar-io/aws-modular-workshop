# ECS on Fargate - Hands-on Lab

[DIAGRAM: ECS Hands-on Architecture]
Description: A detailed diagram showing the ECS resources we'll create in this lab. The diagram should:

1. Show the complete architecture:
   - ECS Cluster
   - Fargate Service
   - Task Definition
   - Load Balancer
   - VPC Configuration
2. Illustrate the relationships between components
3. Show the container patterns
4. Include example service integrations
   Use AWS's standard color scheme with blue for AWS services and green for ECS components.

## Prerequisites

This lab builds on the ECR and Docker basics lab. Download the completed ECR lab state to begin:

```bash
curl <S3_URL>/lab-240-completed.zip -o lab-240-completed.zip
unzip lab-240-completed.zip
cd lab-240-completed
npm install
```

## Lab Steps

### 1. Create VPC for Fargate

First, let's create a VPC for our Fargate tasks:

```typescript
const vpc = new ec2.Vpc(this, "FargateVPC", {
  maxAzs: 2,
  subnetConfiguration: [
    {
      cidrMask: 24,
      name: "Public",
      subnetType: ec2.SubnetType.PUBLIC,
    },
    {
      cidrMask: 24,
      name: "Private",
      subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
    },
  ],
});
```

### 2. Create ECS Cluster and Fargate Service

Now we'll create an ECS cluster and Fargate service using our existing ECR repository:

```typescript
const cluster = new ecs.Cluster(this, "FargateCluster", {
  vpc,
});

const taskDefinition = new ecs.FargateTaskDefinition(this, "TaskDef", {
  memoryLimitMiB: 512,
  cpu: 256,
});

// Use the existing ECR repository from lab 240
taskDefinition.addContainer("MyContainer", {
  image: ecs.ContainerImage.fromEcrRepository(repository, "latest"),
  // ... container configuration
});

const service = new ecs.FargateService(this, "Service", {
  cluster,
  taskDefinition,
  // ... service configuration
});
```

### 3. Configure Auto Scaling

Add auto scaling to your service:

```typescript:lib/ecs-stack.ts
const scaling = service.autoScaleTaskCount({
  minCapacity: 2,
  maxCapacity: 4,
});

scaling.scaleOnCpuUtilization('CpuScaling', {
  targetUtilizationPercent: 70,
  scaleInCooldown: cdk.Duration.seconds(60),
  scaleOutCooldown: cdk.Duration.seconds(60),
});
```

### 4. Configure Service Discovery

Add service discovery to your ECS stack:

```typescript:lib/ecs-stack.ts
const namespace = new ecs.CloudMapNamespace(this, 'WorkshopNamespace', {
  vpc,
  name: 'workshop.local',
});

const serviceDiscovery = service.enableCloudMap({
  name: 'workshop-app',
  cloudMapNamespace: namespace,
});
```

### 5. Implement Container Health Checks

Add health check to your service:

```typescript:lib/ecs-stack.ts
taskDefinition.addContainer('MyContainer', {
  image: ecs.ContainerImage.fromEcrRepository(repository, 'latest'),
  healthCheck: {
    command: ['CMD-SHELL', 'curl -f http://localhost:3000/ || exit 1'],
    interval: cdk.Duration.seconds(30),
    timeout: cdk.Duration.seconds(5),
    retries: 3,
    startPeriod: cdk.Duration.seconds(60),
  },
});
```

### 6. Configure Enhanced Monitoring

Add Container Insights and X-Ray:

```typescript:lib/ecs-stack.ts
const xrayContainer = {
  image: ecs.ContainerImage.fromRegistry('amazon/aws-xray-daemon'),
  memoryLimitMiB: 256,
  cpu: 256,
  logging: new ecs.AwsLogDriver({
    streamPrefix: 'xray-daemon',
  }),
};

taskDef.addContainer('xray', xrayContainer);
```

### 7. Test the Deployment

Access your application:

```bash
# Get the Load Balancer DNS name
aws cloudformation describe-stacks \
  --stack-name EcsStack \
  --query 'Stacks[0].Outputs[?OutputKey==`LoadBalancerDNS`].OutputValue' \
  --output text \
  --profile your-profile-name
```

Test scaling:

```bash
# Generate load
for i in {1..100}; do
  curl http://your-load-balancer-dns/
  sleep 1
done
```

### 8. View Logs and Metrics

Check CloudWatch logs:

```bash
aws logs get-log-events \
  --log-group-name /ecs/workshop-app \
  --log-stream-name your-log-stream \
  --profile your-profile-name
```

View Container Insights:

1. Open CloudWatch console
2. Navigate to Container Insights
3. Select your ECS cluster
4. View performance metrics

## Validation Steps

1. Deployment

   - [ ] Services running with desired task count
   - [ ] Load balancer health checks passing
   - [ ] Application accessible via load balancer

2. Monitoring

   - [ ] CloudWatch logs visible
   - [ ] Container Insights showing metrics
   - [ ] X-Ray traces available

3. Scaling
   - [ ] Auto scaling responds to load
   - [ ] Tasks distributed across AZs
   - [ ] Service recovery works

## Troubleshooting

1. Task Launch Issues

   - Check task definition
   - Verify ECR permissions
   - Review CloudWatch logs
   - Check security groups

2. Load Balancer Issues

   - Verify target group health
   - Check security group rules
   - Review access logs

3. Service Discovery
   - Verify namespace creation
   - Check DNS resolution
   - Review service registry

## Cleanup

Remove the stack:

```bash
cdk destroy EcsStack --profile your-profile-name
```

Additional cleanup:

```bash
# Delete CloudWatch log groups
aws logs delete-log-group \
  --log-group-name /ecs/workshop-app \
  --profile your-profile-name

# Delete ECR images (if no longer needed)
aws ecr delete-repository \
  --repository-name workshop-app \
  --force \
  --profile your-profile-name
```

[DIAGRAM: ECS Deployment Flow]
Instructions for draw.io:

1. Create a new diagram using the AWS Architecture 2023 template
2. Use the following AWS symbols from the symbol pack:
   - AWS ECS icon
   - AWS Fargate icon
   - AWS VPC icon
   - AWS Application Load Balancer icon
   - AWS CloudWatch icon
3. Layout:
   - Create a flowchart using AWS's standard flowchart shapes
   - Use diamond shapes for decision points
   - Use AWS's standard connector arrows
4. Add process boxes for:
   - Task Definition Creation
   - Service Deployment
   - Container Scheduling
   - Load Balancer Configuration
5. Use AWS's standard color scheme for all elements

## Creating ECS Resources

### 1. Create VPC for Fargate

First, let's create a VPC for our Fargate tasks:

```typescript
const vpc = new ec2.Vpc(this, "FargateVPC", {
  maxAzs: 2,
  subnetConfiguration: [
    {
      cidrMask: 24,
      name: "Public",
      subnetType: ec2.SubnetType.PUBLIC,
    },
    {
      cidrMask: 24,
      name: "Private",
      subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
    },
  ],
});
```

### 2. Create ECS Cluster and Fargate Service

Now we'll create an ECS cluster and Fargate service using our existing ECR repository:

```typescript
const cluster = new ecs.Cluster(this, "FargateCluster", {
  vpc,
});

const taskDefinition = new ecs.FargateTaskDefinition(this, "TaskDef", {
  memoryLimitMiB: 512,
  cpu: 256,
});

// Use the existing ECR repository from lab 240
taskDefinition.addContainer("MyContainer", {
  image: ecs.ContainerImage.fromEcrRepository(repository, "latest"),
  // ... container configuration
});

const service = new ecs.FargateService(this, "Service", {
  cluster,
  taskDefinition,
  // ... service configuration
});
```

### 3. Configure Auto Scaling

Add auto scaling to your service:

```typescript:lib/ecs-stack.ts
const scaling = service.autoScaleTaskCount({
  minCapacity: 2,
  maxCapacity: 4,
});

scaling.scaleOnCpuUtilization('CpuScaling', {
  targetUtilizationPercent: 70,
  scaleInCooldown: cdk.Duration.seconds(60),
  scaleOutCooldown: cdk.Duration.seconds(60),
});
```

### 4. Configure Service Discovery

Add service discovery to your ECS stack:

```typescript:lib/ecs-stack.ts
const namespace = new ecs.CloudMapNamespace(this, 'WorkshopNamespace', {
  vpc,
  name: 'workshop.local',
});

const serviceDiscovery = service.enableCloudMap({
  name: 'workshop-app',
  cloudMapNamespace: namespace,
});
```

### 5. Implement Container Health Checks

Add health check to your service:

```typescript:lib/ecs-stack.ts
taskDefinition.addContainer('MyContainer', {
  image: ecs.ContainerImage.fromEcrRepository(repository, 'latest'),
  healthCheck: {
    command: ['CMD-SHELL', 'curl -f http://localhost:3000/ || exit 1'],
    interval: cdk.Duration.seconds(30),
    timeout: cdk.Duration.seconds(5),
    retries: 3,
    startPeriod: cdk.Duration.seconds(60),
  },
});
```

### 6. Configure Enhanced Monitoring

Add Container Insights and X-Ray:

```typescript:lib/ecs-stack.ts
const xrayContainer = {
  image: ecs.ContainerImage.fromRegistry('amazon/aws-xray-daemon'),
  memoryLimitMiB: 256,
  cpu: 256,
  logging: new ecs.AwsLogDriver({
    streamPrefix: 'xray-daemon',
  }),
};

taskDef.addContainer('xray', xrayContainer);
```

### 7. Test the Deployment

Access your application:

```bash
# Get the Load Balancer DNS name
aws cloudformation describe-stacks \
  --stack-name EcsStack \
  --query 'Stacks[0].Outputs[?OutputKey==`LoadBalancerDNS`].OutputValue' \
  --output text \
  --profile your-profile-name
```

Test scaling:

```bash
# Generate load
for i in {1..100}; do
  curl http://your-load-balancer-dns/
  sleep 1
done
```
