# Setting Up Your Development Environment

[DIAGRAM: Development Environment Setup]
Description: A comprehensive diagram showing the complete development environment setup for AWS CDK. The diagram should:

1. Show the local development environment with:
   - IDE/Code editor
   - Node.js/Python runtime
   - AWS CLI configuration
   - CDK CLI installation
2. Display the connection to AWS services:
   - IAM roles and permissions
   - CloudFormation service
   - S3 bucket for assets
3. Include the development workflow arrows
   Use AWS's standard color scheme with blue for AWS services and green for local development components.

## Prerequisites

Before starting this lab, ensure you have:

- An AWS account with appropriate permissions
- Node.js (version 14.x or later) installed
- AWS CLI version 2 installed
- A code editor (VS Code recommended)

## Configure AWS Credentials

First, let's set up your AWS credentials using AWS IAM Identity Center (formerly AWS SSO):

1. **Configure AWS CLI with IAM Identity Center**:

   ```bash
   aws configure sso
   ```

   You'll need to provide:

   - SSO start URL (from your AWS administrator)
   - SSO Region
   - Default client Region
   - Default output format (json recommended)

2. **Verify Configuration**:

   ```bash
   aws sts get-caller-identity --profile your-profile-name
   ```

   This should display your AWS account ID, user ID, and ARN.

## Set Up Your CDK Environment

1. **Install the AWS CDK Toolkit**:

   ```bash
   npm install -g aws-cdk
   ```

   Verify the installation:

   ```bash
   cdk --version
   ```

2. **Bootstrap Your AWS Environment**:

   ```bash
   cdk bootstrap --profile your-profile-name
   ```

   This creates the necessary resources in your AWS account to deploy CDK applications.

## Create Your First CDK Project

1. **Initialize a New Project**:

   ```bash
   mkdir my-cdk-app
   cd my-cdk-app
   cdk init app --language typescript
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

## Project Structure Overview

Let's examine the key files created by CDK:

- `bin/my-cdk-app.ts`: Entry point for your CDK app
- `lib/my-cdk-app-stack.ts`: Main stack definition
- `cdk.json`: CDK configuration file
- `package.json`: Project dependencies and scripts
- `tsconfig.json`: TypeScript configuration

## Create Your First Stack

1. **Open `lib/my-cdk-app-stack.ts`** and replace its contents with:

   ```typescript
   import { Stack, StackProps, CfnOutput } from "aws-cdk-lib";
   import { Construct } from "constructs";

   export class MyCdkAppStack extends Stack {
     constructor(scope: Construct, id: string, props?: StackProps) {
       super(scope, id, props);

       // Add a CloudFormation output
       new CfnOutput(this, "MyFirstOutput", {
         value: "Hello, AWS CDK!",
         description: "A simple output to verify our CDK deployment",
         exportName: "MyFirstOutput",
       });
     }
   }
   ```

2. **Synthesize the CloudFormation Template**:

   ```bash
   cdk synth --profile your-profile-name
   ```

   This command generates the CloudFormation template from your CDK code. Review the output to see the YAML template that CDK created.

3. **Deploy the Stack**:

   ```bash
   cdk deploy --profile your-profile-name
   ```

   When prompted to approve security-related changes, review them and enter 'y' to proceed.

## Verify Your Deployment

1. **Check CloudFormation Console**:

   - Open the AWS Management Console
   - Navigate to CloudFormation
   - Find your stack in the list
   - Check the "Outputs" tab to see your "Hello, AWS CDK!" message

2. **Using AWS CLI**:
   ```bash
   aws cloudformation describe-stacks \
     --stack-name my-cdk-app \
     --query 'Stacks[0].Outputs[0].OutputValue' \
     --profile your-profile-name
   ```

## Clean Up

When you're done experimenting, clean up your resources:

```bash
cdk destroy --profile your-profile-name
```

## Troubleshooting Tips

If you encounter issues:

1. **CDK Bootstrap Errors**:

   - Ensure you have sufficient IAM permissions
   - Check if the region is correctly specified
   - Verify your AWS credentials are properly configured

2. **Deployment Failures**:

   - Review the CloudFormation events in the AWS Console
   - Check your CDK code for syntax errors
   - Ensure all required dependencies are installed

3. **Permission Issues**:
   - Verify your IAM permissions
   - Check if your SSO session is still active
   - Try refreshing your SSO credentials

## Best Practices

1. **Version Control**:

   - Initialize a git repository for your CDK project
   - Create a `.gitignore` file (CDK generates this for you)
   - Commit your changes regularly

2. **Code Organization**:

   - Keep stacks focused and single-purpose
   - Use constructs to encapsulate reusable components
   - Comment your code appropriately

3. **Security**:
   - Review security changes before deployment
   - Follow the principle of least privilege
   - Use environment-specific configurations

## Next Steps

Now that you've created and deployed your first CDK application, you're ready to:

- Learn about more advanced CDK concepts
- Create more complex stacks
- Explore AWS service constructs
- Build reusable infrastructure patterns

In the next lab, we'll build on these foundations to create more sophisticated infrastructure components.

[DIAGRAM: CDK Development Workflow]
Description: A sequence diagram showing the typical CDK development workflow. The diagram should:

1. Show the development cycle:
   - Code writing
   - Local testing
   - CDK synthesis
   - Deployment
   - Verification
2. Include feedback loops and iteration points
3. Show the relationship between local development and AWS services
4. Highlight key commands and their effects
   Use AWS's standard color scheme and include clear labels for each step.
