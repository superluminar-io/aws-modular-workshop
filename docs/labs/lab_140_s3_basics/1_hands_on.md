# S3 Basics - Hands-on Lab

[DIAGRAM: S3 Hands-on Architecture]
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

Note: You'll need to wait 30 days to see the storage class transition take effect in a real environment.

### 5. Explore Bucket Properties

Use the AWS Console to explore the bucket's configuration:

1. Navigate to the S3 service in the AWS Console
2. Find and select your bucket
3. Explore the following tabs:
   - Properties (versioning, encryption settings)
   - Permissions (access control settings)
   - Management (lifecycle rules)

### 6. Add a Bucket Policy

Let's update our stack to add a bucket policy:

```typescript
import { PolicyStatement, Effect, ArnPrincipal } from "aws-cdk-lib/aws-iam";

// ... inside the stack constructor ...

// Add a bucket policy that allows read access from a specific IAM role
bucket.addToResourcePolicy(
  new PolicyStatement({
    effect: Effect.ALLOW,
    actions: ["s3:GetObject"],
    resources: [bucket.arnForObjects("*")],
    principals: [new ArnPrincipal("arn:aws:iam::ACCOUNT_ID:role/ROLE_NAME")],
  })
);
```

Deploy the updated stack:

```bash
cdk deploy --profile your-profile-name
```

### 7. Clean Up Test Files

Remove the test files from the bucket:

```bash
aws s3 rm s3://BUCKET_NAME/test.txt --profile your-profile-name
```

## Validation Steps

After completing the lab, verify that:

1. ✅ The bucket was created with the specified configurations
2. ✅ You can upload and download files
3. ✅ Versioning is working as expected
4. ✅ The bucket policy is applied correctly
5. ✅ Public access is blocked

## Troubleshooting

If you encounter issues:

1. **Access Denied Errors**

   - Check your AWS credentials
   - Verify bucket policies and permissions
   - Ensure public access settings are as expected

2. **Versioning Issues**

   - Confirm versioning is enabled
   - Check object versions using the AWS Console
   - Verify version IDs in API responses

3. **Lifecycle Rules**
   - Review rule configurations in the console
   - Check object metadata for storage class
   - Remember transitions take time to apply

## Best Practices Demonstrated

This lab has demonstrated several S3 best practices:

1. **Security**

   - Blocking public access by default
   - Using bucket policies for access control
   - Enabling default encryption

2. **Data Management**

   - Implementing versioning
   - Configuring lifecycle rules
   - Using appropriate storage classes

3. **Cost Optimization**
   - Automatic transition to lower-cost storage
   - Cleanup of test resources
   - Monitoring object versions

## Next Steps

After completing this lab, you can:

- Explore more advanced S3 features
- Integrate S3 with other AWS services
- Implement more complex lifecycle rules
- Configure cross-region replication

[DIAGRAM: S3 Operations Flow]
Instructions for draw.io:

1. Create a new diagram using the AWS Architecture 2023 template
2. Use the following AWS symbols from the symbol pack:
   - AWS S3 icon
   - AWS IAM icon
   - AWS CloudWatch icon
   - AWS Lambda icon (if used)
3. Layout:
   - Create a flowchart using AWS's standard flowchart shapes
   - Use diamond shapes for decision points
   - Use AWS's standard connector arrows
4. Add process boxes for:
   - Bucket Creation
   - Object Upload
   - Access Control
   - Lifecycle Management
5. Use AWS's standard color scheme for all elements
