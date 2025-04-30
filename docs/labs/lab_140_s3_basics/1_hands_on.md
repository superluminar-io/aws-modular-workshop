# S3 Basics - Hands-on Lab

[DIAGRAM: S3 Hands-on Architecture]
Instructions for draw.io:

1. Create a new diagram using the AWS Architecture 2023 template
2. Use the following AWS symbols from the symbol pack:
   - AWS S3 icon
   - AWS IAM icon
   - AWS CloudWatch icon
   - AWS Lambda icon (if used)
3. Layout:
   - Place S3 bucket at the center
   - Add IAM roles and policies on the left
   - Place CloudWatch monitoring on the right
   - Add lifecycle rules visualization
4. Use AWS's standard connector arrows to show relationships
5. Add bucket policy and versioning visualization

Description: A detailed diagram showing the S3 resources we'll create in this lab. The diagram should:

1. Show the complete architecture:
   - S3 Buckets
   - Bucket Policies
   - Lifecycle Rules
   - Access Points
2. Illustrate the relationships between components
3. Show the data flow patterns
4. Include example service integrations
   Use AWS's standard color scheme with blue for AWS services and green for S3 components.

## Prerequisites

- Completed the CDK Foundations lab
- AWS CDK and CLI configured with appropriate permissions

## Lab Steps

### 1. Create an S3 Bucket with CDK

Update your stack file with the following code:

```typescript
import {
  CfnOutput,
  Duration,
  RemovalPolicy,
  Stack,
  StackProps,
} from "aws-cdk-lib";
import { Bucket, BucketEncryption, ObjectOwnership } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

export class AwsFundamentalsWorkshopLabsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create an S3 bucket with various configurations
    const bucket = new Bucket(this, "MyWorkshopBucket", {
      // Enable versioning for object version control
      versioned: true,

      // Enable encryption by default
      encryption: BucketEncryption.S3_MANAGED,

      // Configure lifecycle rules
      lifecycleRules: [
        {
          // Move objects to infrequent access tier after 30 days
          transitions: [
            {
              storageClass: StorageClass.INFREQUENT_ACCESS,
              transitionAfter: Duration.days(30),
            },
          ],
        },
      ],

      // Block all public access
      publicReadAccess: false,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,

      // Ensure the bucket and its contents can be deleted when running cdk destroy
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,

      // Use recommended settings for object ownership
      objectOwnership: ObjectOwnership.BUCKET_OWNER_PREFERRED,
    });

    // Output the bucket name for reference
    new CfnOutput(this, "BucketName", {
      value: bucket.bucketName,
      description: "The name of the S3 bucket",
    });
  }
}
```

Deploy the stack:

```bash
cdk deploy --profile your-profile-name
```

### 2. Interact with the Bucket

After deployment, let's interact with our bucket using the AWS CLI:

1. **Create a test file**:

```bash
echo "Hello, S3!" > test.txt
```

2. **Upload the file**:

```bash
aws s3 cp test.txt s3://BUCKET_NAME/test.txt --profile your-profile-name
```

3. **List bucket contents**:

```bash
aws s3 ls s3://BUCKET_NAME --profile your-profile-name
```

4. **Download the file**:

```bash
aws s3 cp s3://BUCKET_NAME/test.txt downloaded.txt --profile your-profile-name
```

### 3. Enable Versioning

Our bucket already has versioning enabled. Let's see it in action:

1. **Upload multiple versions**:

```bash
echo "Version 1" > test.txt
aws s3 cp test.txt s3://BUCKET_NAME/test.txt --profile your-profile-name

echo "Version 2" > test.txt
aws s3 cp test.txt s3://BUCKET_NAME/test.txt --profile your-profile-name
```

2. **List versions**:

```bash
aws s3api list-object-versions --bucket BUCKET_NAME --prefix test.txt --profile your-profile-name
```

### 4. Work with Lifecycle Rules

We've configured a lifecycle rule to move objects to STANDARD_IA storage class after 30 days. To verify this:

1. **Check object storage class**:

```bash
aws s3api head-object --bucket BUCKET_NAME --key test.txt --profile your-profile-name
```
