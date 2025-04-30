# AWS Lego-Style Modular Workshop

## Introduction

The goal of this workshop is to provide a modular learning experience for AWS services, allowing participants to add and remove services without disrupting other components. Each service module should be deployable with a single click using AWS CDK, ensuring that earlier sections can be removed without affecting later ones.

This document outlines the core principles, structure, and plan for building this workshop.

### Core Principles

1. Modularity: Each lab should function independently while seamlessly integrating with others when necessary.
2. One-Click Deployment: AWS CDK should handle all infrastructure deployment.
3. Removability: Each lab must be disposable without breaking dependencies for later labs.
4. Prerequisite Knowledge Sections: Labs will contain optional prerequisite knowledge modules to help participants who need foundational knowledge.
5. Progressive Learning: The workshop will start with foundational AWS services and gradually progress to more advanced topics.
6. Self-Contained Labs: Each lab should focus on a single AWS service. Those that require integration should include catch-up mechanisms to ensure participants can follow along even if they skipped earlier modules. 7. Single Repository Organization for Lab Code: All lab code will be housed in a separate public GitHub repository, organized by folders for each module. The instructions will guide participants to pull the correct folder as needed, while the workshop documentation remains internal.

## Workshop Structure and Lab Format

Each lab follows a structured format to ensure clarity and consistency for participants. Labs will begin with an optional setup and catch-up section, include a brief prerequisite knowledge recap, and provide step-by-step instructions. Each lab will conclude with a summary and continued learning resources.

### Lab Structure

1. Optional Setup & Catch-Up
   - Instructions for setting up AWS CDK and deploying previous labs if necessary.
   - Quick overview of the project state so far.
   - Instructions for navigating to the correct folder in the repository.
2. Prerequisite Knowledge Recap
   - A concise recap of necessary concepts for participants who may need a refresher.
   - Easy to skip for those already familiar.
3. Lab Steps & Explanations
   - Step-by-step guided instructions for completing the lab.
   - Explanations alongside each step to reinforce learning.
4. Conclusion
   - Summary of what was accomplished and key takeaways.
5. Continued Learning
   - Links to official AWS documentation and other relevant resources for deeper exploration.
6. Tear Down Instructions
   - Steps to remove the deployed resources cleanly.

## Module Sequence

The workshop provides a flexible framework where labs can be added or removed as needed. The numbering system below uses gaps to allow for insertion of new modules without renumbering existing ones. These examples illustrate a progression from foundational to more advanced services, but additional modules can be inserted at any point.

### 100 Series: Fundamental AWS Building Blocks

**LAB-100**: Storage with S3

- Covers S3 bucket configurations, security policies, and basic file operations.
- Deploys an S3 bucket and provides hands-on experience with storage.

**LAB-120**: Compute with EC2

- Covers launching and managing virtual machines, security groups, and IAM roles.
- Deploys an EC2 instance with a simple web server.

**LAB-140**: Networking with VPC

- Covers networking basics, subnets, and security groups.
- Deploys a simple VPC with public and private subnets.

### 200 Series: Core Application Services

**LAB-200**: Serverless Compute with Lambda

- Covers event-driven architecture and Lambda function deployment.
- Deploys a sample Lambda function.

**LAB-220**: Database with DynamoDB

- Covers NoSQL databases, indexing, and querying data.
- Deploys a DynamoDB table with sample CRUD operations.

**LAB-240**: API Management with API Gateway

- Covers creating RESTful APIs and integrating with backend services.
- Deploys API Gateway and connects it to Lambda or EC2 (catch-up mechanism provided).

### 300 Series: Advanced Application Patterns

**LAB-300**: Containerized Applications with ECS on Fargate

- Covers containerization, ECS, and running a managed service.
- Deploys an ECS cluster running a sample application.

**LAB-320**: Event-Driven Architectures with SNS & SQS

- Covers message-based communication between services.
- Deploys SNS and SQS for distributed messaging.

**LAB-340**: Observability with CloudWatch & X-Ray

- Covers monitoring, logging, and tracing in AWS.
- Deploys CloudWatch alarms and X-Ray tracing for a sample workload.

Additional labs can be added at any point using the numbering convention. For example:

- A new lab on RDS could be added as LAB-230 (between DynamoDB and API Gateway)
- A lab on CloudFront could be inserted as LAB-110 (between S3 and EC2)
- Specialized topics could use numbers like LAB-350 or extend to new series (LAB-400)

## Lab Code Repository Structure

All lab code will reside in a separate public GitHub repository, structured as follows:

aws-workshop-labs/
│── README.md
│── labs/
│ ├── 01-s3/
│ │ ├── cdk/
│ │ │ ├── bin/
│ │ │ ├── lib/
│ │ │ ├── package.json
│ │ │ ├── tsconfig.json
│ ├── 02-ec2/
│ │ ├── cdk/
│ ├── 03-vpc/

Each lab resides in its own folder under labs/, containing:

- A CDK folder (cdk/) with necessary deployment scripts.
- A README with minimal guidance and links to the private workshop content.
- The public repo contains no workshop explanations, ensuring that documentation remains private.

## Integration Between the Two Repos

In the private workshop repo, instructional content will reference the public code repo:

1. Click the download link provided by your instructor
2. Extract the downloaded zip file to your preferred location
3. Open a terminal and navigate to the extracted folder:
   ```bash
   cd path/to/extracted/cdk
   npm install
   cdk deploy
   ```

Note: The download link is valid for 24 hours. If you need access after this period, please contact your workshop instructor for a new link.

The public lab repo will have a README with minimal instructions:

This repository contains AWS CDK infrastructure for the AWS modular workshop. Full workshop instructions are available internally.

## CDK Standardization and Catch-Up Mechanism

This workshop primarily uses AWS CDK for deployments, ensuring that each lab can be deployed programmatically while maintaining modularity. To maintain consistency, each module should:

- Output key resource ARNs for easy reference in later modules.
- Include necessary IAM permissions scoped to least privilege.
- Provide clear teardown instructions to ensure removability.
- Offer a catch-up mechanism to deploy necessary resources if earlier modules were skipped.
- Be stored in a structured folder hierarchy in the public GitHub repository, with each module having its own directory.

## Development Plan

1. Define Core Modules: Identify foundational AWS services that should be included.
2. Set Up CDK and Catch-Up Instructions: Provide guidance for setting up AWS CDK, pulling down previous labs if needed, and reviewing the project state before proceeding.
3. Organize Repository Structure: Create a folder structure where each lab has its own directory within a single GitHub repository.
4. Write Lab Instructions: Ensure clarity and include prerequisite knowledge where needed.
5. Test Module Independence: Validate that removing any module does not disrupt the workshop.
6. Release Internally for Feedback: Gather internal feedback before public rollout.

This document will evolve as we develop the workshop. Feedback is encouraged to refine the approach and ensure it aligns with best practices and learning objectives.

## Getting Started

### For Workshop Instructors

Before the workshop, generate a secure download link for participants:

1. Ensure you have AWS credentials configured
2. Run the URL generator:
   ```bash
   npm install
   npx ts-node scripts/generate-workshop-url.ts
   ```
3. Copy the generated URL to share with participants
