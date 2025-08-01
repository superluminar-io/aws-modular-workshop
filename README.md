# AWS Modular Workshop

## Overview

This repository contains a modular AWS workshop where each lab can be completed independently. Labs are designed to be "Lego-style" - you can add or remove modules without disrupting others, while maintaining the ability to integrate them when desired.

## Quick Access

**🌐 Workshop URL**: Deploy using the CDK instructions below for global CloudFront access

## Repository Structure

```
lego-workshop/
├── docs/                          # Workshop content (deployed to S3)
│   ├── index.html                # Docsify entry point
│   ├── 0_welcome.md              # Workshop introduction
│   ├── 1_core_concepts.md        # AWS fundamentals overview
│   ├── 2_next.md                 # Next steps and continued learning
│   ├── 3_conclusion.md           # Workshop summary and wrap-up
│   ├── 4_glossary.md             # Comprehensive AWS terminology
│   ├── sidebar.md                # Navigation structure
│   ├── labs/                     # Individual lab instructions
│   │   ├── lab_100_cdk_foundations/
│   │   │   ├── 0_intro.md        # Lab introduction and objectives
│   │   │   ├── 1_hands_on.md     # Step-by-step instructions
│   │   │   └── 2_resources.md    # Additional learning resources
│   │   ├── lab_120_iam_permissions/
│   │   ├── lab_140_s3_basics/
│   │   ├── lab_160_vpc_networking/
│   │   ├── lab_180_ec2_deployment/
│   │   ├── ... (24 total labs)
│   │   └── lab_cleanup.md        # Workshop cleanup instructions
│   └── media/                    # Images, diagrams, and assets
│       ├── aws_global_infra.png
│       ├── logo.svg
│       ├── welcome.png
│       └── *.drawio.svg          # Architecture diagrams
├── infra/                        # CDK deployment infrastructure
│   ├── lib/
│   │   └── infra-stack.ts       # Main CloudFront deployment stack
│   ├── bin/
│   │   └── infra.ts             # CDK app entry point
│   ├── package.json             # CDK dependencies
│   ├── cdk.json                 # CDK configuration
│   └── tsconfig.json            # TypeScript configuration
├── package.json                  # Workshop dev dependencies (docsify)
├── package-lock.json            # Dependency lock file
└── README.md                     # Quick start and deployment guide
```

## Workshop Structure and Lab Format

Each lab follows a structured format to ensure clarity and consistency for participants. Labs begin with clear learning objectives, include prerequisite knowledge recaps, and provide comprehensive step-by-step instructions.

### Lab Structure

1. **Introduction** (`0_intro.md`)

   - Clear learning objectives and outcomes
   - Prerequisites and assumed knowledge
   - Architecture overview with diagrams
   - Key concepts and terminology
   - Real-world use cases and scenarios

2. **Hands-On Instructions** (`1_hands_on.md`)

   - Step-by-step guided implementation
   - Code examples with explanations
   - Validation and testing procedures
   - Troubleshooting common issues
   - Best practices and security considerations

3. **Additional Resources** (`2_resources.md`)
   - Official AWS documentation links
   - Advanced configuration options
   - Related services and integrations
   - Continued learning pathways
   - Community resources and tools

### Catch-Up Mechanisms

Each lab includes mechanisms to ensure participants can start from any point:

- Quick setup instructions for prerequisite resources
- Pre-built CloudFormation templates for complex dependencies
- Clear state verification steps
- Resource ARN outputs for easy reference

## Module Sequence

The workshop provides a flexible framework where labs can be added or removed as needed. The numbering system uses gaps to allow for insertion of new modules without renumbering existing ones.

### 100 Series: Fundamental AWS Building Blocks

**LAB-100**: CDK Foundations

- AWS CDK setup and basic concepts
- Infrastructure as Code principles
- CloudFormation integration
- Project structure and best practices

**LAB-120**: IAM Permissions

- Identity and Access Management fundamentals
- Roles, policies, and permission boundaries
- Security best practices
- Hands-on permission configuration

**LAB-140**: S3 Basics

- Object storage concepts and configurations
- Bucket policies and security
- Lifecycle management and cost optimization
- Integration with other AWS services

**LAB-160**: VPC Networking

- Virtual Private Cloud design
- Subnets, routing, and security groups
- NAT gateways and internet connectivity
- Network security best practices

**LAB-180**: EC2 Deployment

- Virtual machine concepts and types
- Instance configuration and management
- Security groups and key pairs
- Monitoring and troubleshooting

### 200 Series: Core Application Services

**LAB-200**: Systems Manager

- Centralized configuration management
- Parameter Store for application config
- Session Manager for secure access
- Patch management and compliance

**LAB-220**: RDS Basics

- Relational database concepts
- Multi-AZ and read replica configuration
- Backup and recovery strategies
- Performance monitoring and optimization

**LAB-240**: ECR Docker Basics

- Container registry concepts
- Image lifecycle management
- Security scanning and compliance
- Integration with deployment pipelines

**LAB-260**: ECS on Fargate

- Containerized application deployment
- Service discovery and load balancing
- Auto-scaling and resource optimization
- Monitoring and logging strategies

**LAB-280**: DynamoDB Basics

- NoSQL database concepts and design
- Partition and sort key strategies
- Global secondary indexes
- Performance and cost optimization

### 300 Series: Advanced Application Patterns

**LAB-300**: Aurora Serverless

- Serverless database concepts
- Auto-scaling and cost benefits
- Integration with Lambda functions
- Advanced querying and optimization

**LAB-320**: CI/CD Infrastructure

- Continuous integration/deployment pipelines
- CodePipeline and CodeBuild integration
- Infrastructure testing and validation
- Blue/green deployment strategies

**LAB-340**: CI/CD Containers

- Container-based deployment pipelines
- Multi-stage build optimization
- Security scanning integration
- Production deployment strategies

**LAB-360**: Lambda Event Triggers

- Serverless computing concepts
- Event-driven architecture patterns
- Integration with AWS services
- Performance optimization and monitoring

**LAB-380**: API Gateway Integration

- RESTful API design and implementation
- Authentication and authorization
- Rate limiting and usage plans
- API versioning and documentation

### 400+ Series: Enterprise & Operations

**LAB-400**: SNS/SQS Messaging

- Asynchronous messaging patterns
- Pub/sub and queue-based architectures
- Dead letter queues and error handling
- Message ordering and deduplication

**LAB-420**: EventBridge

- Event-driven architecture at scale
- Custom event buses and rules
- Third-party integration patterns
- Event replay and archiving

**LAB-440**: Step Functions

- Workflow orchestration concepts
- State machine design patterns
- Error handling and retry logic
- Integration with AWS services

**LAB-460**: Secrets Manager

- Centralized secrets management
- Automatic rotation strategies
- Integration with applications
- Compliance and auditing

**LAB-480**: Resource Policies

- Advanced IAM concepts
- Cross-account access patterns
- Resource-based policies
- Compliance and governance

**LAB-500**: AWS Backup

- Centralized backup strategies
- Cross-region and cross-account backup
- Compliance and retention policies
- Disaster recovery planning

**LAB-520**: CloudWatch Logs

- Centralized logging strategies
- Log aggregation and analysis
- Custom metrics and alarms
- Cost optimization techniques

**LAB-540**: X-Ray Tracing

- Distributed tracing concepts
- Performance analysis and optimization
- Error detection and debugging
- Service map visualization

**LAB-560**: CloudTrail Audit

- API call logging and monitoring
- Compliance and security auditing
- Event analysis and alerting
- Integration with SIEM systems

## Deployment & Access Model

### Current Implementation Benefits

✅ **Simplified Access**: No downloads, installations, or local setup required  
✅ **Global Availability**: CloudFront edge locations provide fast access worldwide  
✅ **Enterprise Security**: HTTPS encryption and AWS security best practices  
✅ **Mobile Responsive**: Works perfectly on tablets, phones, and desktops  
✅ **Easy Updates**: Single deployment updates entire workshop globally  
✅ **Cost Effective**: Minimal AWS costs for global distribution  
✅ **Version Control**: All content tracked in git with full history  
✅ **Zero Maintenance**: No servers to manage or maintain

### For Workshop Instructors

**Deploy the workshop globally**:

```bash
# One-time setup
cd infra
npm install
cdk bootstrap

# Deploy workshop
npm run build
cdk deploy

# Workshop is now available globally at CloudFront URL
```

**Update workshop content**:

```bash
# Make changes to docs/ folder
# Redeploy automatically
cdk deploy
```

### For Participants

**Zero setup required**:

- Simply access the provided CloudFront URL
- Works on any device with a web browser
- HTTPS encryption for secure access
- Start with any lab (catch-up mechanisms included)
- No local installation or configuration needed

## Integration and Modularity

### CDK Standardization

Each lab maintains consistency through:

- **Standardized Outputs**: Key resource ARNs exported for cross-lab reference
- **IAM Best Practices**: Least privilege permissions scoped appropriately
- **Clean Teardown**: Proper resource cleanup procedures
- **Catch-Up Support**: Deploy prerequisite resources if needed
- **Validation Steps**: Verify deployment success and functionality

### Cross-Lab Integration Points

```typescript
// Example: Lab outputs for integration
new CfnOutput(this, "VpcId", {
  value: vpc.vpcId,
  exportName: "WorkshopVpcId",
})

new CfnOutput(this, "DatabaseEndpoint", {
  value: database.instanceEndpoint.hostname,
  exportName: "WorkshopDbEndpoint",
})
```

## Development and Maintenance

### Adding New Labs

1. **Create lab folder structure**:

   ```bash
   mkdir -p docs/labs/lab_XXX_new_topic/{0_intro.md,1_hands_on.md,2_resources.md}
   ```

2. **Update navigation**:

   - Add to `docs/sidebar.md`
   - Update lab sequence numbers if needed

3. **Follow established patterns**:

   - Use consistent formatting and structure
   - Include diagrams and code examples
   - Provide catch-up mechanisms
   - Add proper cleanup instructions

4. **Deploy updates**:
   ```bash
   cd infra && cdk deploy
   ```

### Content Guidelines

- **Clear Learning Objectives**: Each lab should have 3-5 specific learning outcomes
- **Progressive Complexity**: Build concepts incrementally
- **Real-World Relevance**: Use practical examples and use cases
- **Security First**: Always demonstrate security best practices
- **Cost Awareness**: Include cost considerations and optimization tips

### Planned Improvements

- **German-Language Support**
