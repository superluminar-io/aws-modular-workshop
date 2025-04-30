# ECR and Docker Basics with AWS CDK

## Overview

Amazon Elastic Container Registry (ECR) is a fully managed Docker container registry that makes it easy to store, manage, and deploy Docker container images. In this lab, you'll learn how to work with Docker and ECR using AWS CDK.

[DIAGRAM: ECR Overview]
Instructions for draw.io:

1. Create a new diagram using the AWS Architecture 2023 template
2. Use the following AWS symbols from the symbol pack:
   - AWS ECR icon
   - AWS IAM icon
   - AWS KMS icon
   - AWS CloudWatch icon
   - AWS ECS icon
3. Layout:
   - Place ECR at the center
   - Add repositories around it
   - Place security services on the right
   - Show container services on the left
4. Use AWS's standard connector arrows to show relationships
5. Add container visualization with image layers

## Learning Objectives

- Understand basic Docker concepts and commands
- Create and manage Docker images locally
- Work with Amazon ECR repositories
- Push and pull container images to/from ECR
- Implement ECR security best practices

## Core Concepts

### Docker Fundamentals

1. **Container Basics**

   ```
   ┌─────────────────────────┐
   │     Your Application    │
   ├─────────────────────────┤
   │      Dependencies      │
   ├─────────────────────────┤
   │   Container Runtime    │
   └─────────────────────────┘
   ```

   - Containers vs Virtual Machines
   - Docker architecture
   - Container lifecycle

2. **Docker Components**
   - Dockerfile
   - Images
   - Containers
   - Layers and caching
   - Docker CLI

### ECR Features

1. **Repository Management**

   - Private repositories
   - Public repositories (Amazon ECR Public Gallery)
   - Image versioning and tagging
   - Repository policies

2. **Security Features**

   - IAM integration
   - Encryption at rest (AWS KMS)
   - Image scanning
   - HTTPS/SSL encryption in transit

3. **Integration Capabilities**
   ```
   ┌─────────┐   ┌─────────┐   ┌─────────┐
   │  ECR    │──▶│  ECS    │   │  EKS    │
   └─────────┘   └─────────┘   └─────────┘
        │             │             │
        └─────────────┴─────────────┘
                     │
              AWS Services
   ```
   - Amazon ECS
   - Amazon EKS
   - AWS Lambda
   - AWS CodeBuild

### Image Lifecycle

1. **Build Process**

   ```
   Dockerfile    Image      Container
   ┌────────┐   ┌────────┐   ┌────────┐
   │        │──▶│        │──▶│        │
   └────────┘   └────────┘   └────────┘
   ```

   - Writing Dockerfiles
   - Building images
   - Testing locally

2. **Image Management**
   - Tagging strategies
   - Version control
   - Image cleanup
   - Lifecycle policies

### Authentication and Access

1. **Registry Authentication**

   - AWS CLI authentication
   - Docker login integration
   - Access tokens
   - Cross-account access

2. **Permission Management**
   - Repository policies
   - IAM roles and users
   - Resource-based policies

## Best Practices

1. **Security**

   - Use private repositories for sensitive images
   - Implement image scanning
   - Regular security updates
   - Proper access control
   - Use immutable tags

2. **Performance**

   - Optimize image sizes
   - Layer caching
   - Multi-stage builds
   - Regional considerations

3. **Operations**

   - Image tagging strategy
   - Lifecycle policies
   - Monitoring and logging
   - Backup procedures

4. **Cost Optimization**
   - Clean up unused images
   - Implement retention policies
   - Monitor storage usage
   - Use appropriate instance types for builds

## Prerequisites for Lab

- AWS CLI installed and configured
- Docker installed locally
- Basic command line familiarity
- AWS account with appropriate permissions

## What's Next

In the hands-on section, you'll:

- Set up Docker locally
- Create a simple application
- Build and test Docker images
- Create an ECR repository
- Push and pull images to/from ECR
- Implement security best practices

[DIAGRAM: Container Workflow]
Instructions for draw.io:

1. Create a new diagram using the AWS Architecture 2023 template
2. Use the following AWS symbols from the symbol pack:
   - AWS ECR icon
   - Docker icon (from Generic symbols)
   - AWS IAM icon
   - AWS CloudWatch icon
   - AWS CodeBuild icon
3. Layout:
   - Create a flowchart using AWS's standard flowchart shapes
   - Use diamond shapes for decision points
   - Use AWS's standard connector arrows
4. Add process boxes for:
   - Image Building
   - Image Tagging
   - Image Pushing
   - Image Pulling
5. Use AWS's standard color scheme for all elements
