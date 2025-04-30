# CI/CD for Containers - Hands-on Lab

[DIAGRAM: Container CI/CD Hands-on Architecture]
Instructions for draw.io:

1. Create a new diagram using the AWS Architecture 2023 template
2. Use the following AWS symbols from the symbol pack:
   - AWS ECR icon
   - AWS CodePipeline icon
   - AWS CodeBuild icon
   - AWS ECS icon
   - AWS CloudWatch icon
3. Layout:
   - Place GitHub icon on the left
   - Add CodePipeline in the middle
   - Place ECR and CodeBuild below
   - Add ECS on the right
4. Use AWS's standard connector arrows to show pipeline flow
5. Add build and test stages visualization

## Prerequisites

- Completed ECR-Docker Basics lab
- Completed ECS on Fargate lab
- GitHub account and repository
- AWS CDK and AWS CLI configured

## Lab Steps

### 1. Create Container Pipeline Infrastructure

Create a new file `lib/container-pipeline-stack.ts`:

```typescript:lib/container-pipeline-stack.ts
import * as cdk from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';
import { Construct } from 'constructs';

export class ContainerPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create ECR Repository
    const repository = new ecr.Repository(this, 'Repository', {
      repositoryName: 'workshop-app',
      imageScanOnPush: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Create CodeBuild Project
    const buildProject = new codebuild.PipelineProject(this, 'BuildProject', {
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
        privileged: true,
      },
      environmentVariables: {
        REPOSITORY_URI: {
          value: repository.repositoryUri,
        },
      },
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          pre_build: {
            commands: [
              'aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $REPOSITORY_URI',
              'COMMIT_HASH=$(echo $CODEBUILD_RESOLVED_SOURCE_VERSION | cut -c 1-7)',
              'IMAGE_TAG=${COMMIT_HASH:=latest}',
            ],
          },
          build: {
            commands: [
              'docker build -t $REPOSITORY_URI:$IMAGE_TAG .',
              'docker tag $REPOSITORY_URI:$IMAGE_TAG $REPOSITORY_URI:latest',
            ],
          },
          post_build: {
            commands: [
              'docker push $REPOSITORY_URI:$IMAGE_TAG',
              'docker push $REPOSITORY_URI:latest',
              'echo "::set-output name=image::$REPOSITORY_URI:$IMAGE_TAG"',
            ],
          },
        },
      }),
    });

    repository.grantPullPush(buildProject);

    // Create Pipeline
    const pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
      pipelineName: 'ContainerPipeline',
    });

    // Add Source Stage
    const sourceOutput = new codepipeline.Artifact();
    const sourceAction = new codepipeline_actions.GitHubSourceAction({
      actionName: 'GitHub',
      owner: 'your-github-username',
      repo: 'your-repo-name',
      branch: 'main',
      oauthToken: cdk.SecretValue.secretsManager('github-token'),
      output: sourceOutput,
    });

    pipeline.addStage({
      stageName: 'Source',
      actions: [sourceAction],
    });

    // Add Build Stage
    const buildOutput = new codepipeline.Artifact();
    const buildAction = new codepipeline_actions.CodeBuildAction({
      actionName: 'BuildAndPush',
      project: buildProject,
      input: sourceOutput,
      outputs: [buildOutput],
    });

    pipeline.addStage({
      stageName: 'Build',
      actions: [buildAction],
    });

    // Create ECS Cluster and Service
    const cluster = new ecs.Cluster(this, 'Cluster', {
      vpc: new cdk.aws_ec2.Vpc(this, 'Vpc', { maxAzs: 2 }),
    });

    const service = new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'Service', {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromEcrRepository(repository, 'latest'),
        containerPort: 3000,
      },
      desiredCount: 2,
      publicLoadBalancer: true,
    });

    // Add Deploy Stage
    const deployAction = new codepipeline_actions.EcsDeployAction({
      actionName: 'Deploy',
      service: service.service,
      imageFile: buildOutput.atPath('imageDefinitions.json'),
    });

    pipeline.addStage({
      stageName: 'Deploy',
      actions: [deployAction],
    });

    // Outputs
    new cdk.CfnOutput(this, 'PipelineUrl', {
      value: `https://${cdk.Stack.of(this).region}.console.aws.amazon.com/codesuite/codepipeline/pipelines/${pipeline.pipelineName}/view`,
    });

    new cdk.CfnOutput(this, 'ServiceUrl', {
      value: service.loadBalancer.loadBalancerDnsName,
    });
  }
}
```

### 2. Set Up Application Files

1. Create a simple Express.js application:

```typescript:src/app.ts
import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.json({ message: 'Hello from containerized app!' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```

2. Create Dockerfile:

```dockerfile:Dockerfile
# Build stage
FROM node:16-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/app.js"]
```

3. Create test configuration:

```typescript:test/app.test.ts
import request from 'supertest';
import { app } from '../src/app';

describe('App', () => {
  it('should return hello message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Hello from containerized app!');
  });
});
```

### 3. Configure GitHub Integration

1. Store GitHub token in Secrets Manager:

```bash
aws secretsmanager create-secret \
  --name github-token \
  --secret-string your-github-token \
  --profile your-profile-name
```

2. Update repository settings:

- Go to your GitHub repository
- Add AWS CodeBuild webhook
- Configure branch protection rules

### 4. Deploy Pipeline

1. Deploy the stack:

```bash
cdk deploy ContainerPipelineStack --profile your-profile-name
```

2. Trigger initial pipeline run:

```bash
git add .
git commit -m "Initial container app setup"
git push origin main
```

### 5. Monitor Deployment

1. Check pipeline status:

```bash
aws codepipeline get-pipeline-state \
  --name ContainerPipeline \
  --profile your-profile-name
```

2. View container logs:

```bash
aws logs get-log-events \
  --log-group-name /aws/codebuild/BuildProject \
  --log-stream-name latest \
  --profile your-profile-name
```

## Validation Steps

1. Pipeline Setup

   - [ ] Pipeline created successfully
   - [ ] GitHub integration working
   - [ ] Build project configured
   - [ ] ECR repository created

2. Build Process

   - [ ] Container builds successfully
   - [ ] Tests passing
   - [ ] Image pushed to ECR
   - [ ] Tags applied correctly

3. Deployment
   - [ ] ECS service running
   - [ ] Application accessible
   - [ ] Health checks passing
   - [ ] Logs available

## Troubleshooting

1. Build Issues

   - Check CodeBuild logs
   - Verify Dockerfile
   - Check ECR permissions
   - Review build environment

2. Deployment Issues

   - Check ECS events
   - Verify task definition
   - Review service logs
   - Check security groups

3. Pipeline Issues
   - Check GitHub webhook
   - Verify IAM roles
   - Review stage logs
   - Check artifacts

## Cleanup

Remove the stack:

```bash
cdk destroy ContainerPipelineStack --profile your-profile-name
```

[DIAGRAM: Container CI/CD Setup Flow]
Instructions for draw.io:

1. Create a new diagram using the AWS Architecture 2023 template
2. Use the following symbols:
   - AWS ECR icon
   - AWS CodePipeline icon
   - AWS CodeBuild icon
   - AWS ECS icon
3. Layout:
   - Create a flowchart using AWS's standard flowchart shapes
   - Use diamond shapes for decision points
   - Use AWS's standard connector arrows
4. Add process boxes for:
   - Repository Creation
   - Build Configuration
   - Test Setup
   - Deployment Configuration
5. Use AWS's standard color scheme for all elements

## Creating Container CI/CD Resources
