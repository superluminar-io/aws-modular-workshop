# AWS Secrets Manager - Resources

## Official Documentation

- [AWS Secrets Manager User Guide](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html)
- [API Reference](https://docs.aws.amazon.com/secretsmanager/latest/apireference/Welcome.html)
- [AWS CLI Reference for Secrets Manager](https://docs.aws.amazon.com/cli/latest/reference/secretsmanager/index.html)
- [AWS SDK Examples](https://docs.aws.amazon.com/secretsmanager/latest/userguide/retrieving-secrets_cache-sdk.html)

## Secret Management

### Creation and Storage

- [Creating Secrets](https://docs.aws.amazon.com/secretsmanager/latest/userguide/create_secret.html)
- [Secret Types](https://docs.aws.amazon.com/secretsmanager/latest/userguide/reference_secret_json_structure.html)
- [Tagging Secrets](https://docs.aws.amazon.com/secretsmanager/latest/userguide/reference_secret_json_structure.html#reference_secret_json_structure_tags)
- [Deleting Secrets](https://docs.aws.amazon.com/secretsmanager/latest/userguide/manage_delete-secret.html)

### Rotation Configuration

- [Automatic Rotation](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotate-secrets_turn-on-for-other.html)
- [Rotation Function Templates](https://docs.aws.amazon.com/secretsmanager/latest/userguide/reference_available-rotation-templates.html)
- [Custom Rotation Functions](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotate-secrets_how.html)
- [Troubleshooting Rotation](https://docs.aws.amazon.com/secretsmanager/latest/userguide/troubleshoot_rotation.html)

## Security and Access Control

### IAM and Permissions

- [Authentication and Access Control](https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access.html)
- [IAM Policy Examples](https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access_examples.html)
- [Resource-Based Policies](https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access_resource-based-policies.html)
- [Cross-Account Access](https://docs.aws.amazon.com/secretsmanager/latest/userguide/auth-and-access_share-secrets.html)

### Encryption and Security

- [Encryption at Rest](https://docs.aws.amazon.com/secretsmanager/latest/userguide/security-encryption.html)
- [KMS Integration](https://docs.aws.amazon.com/secretsmanager/latest/userguide/security-encryption-kms-keys.html)
- [VPC Endpoints](https://docs.aws.amazon.com/secretsmanager/latest/userguide/vpc-endpoint-overview.html)
- [Security Best Practices](https://docs.aws.amazon.com/secretsmanager/latest/userguide/best-practices.html)

## AWS CDK Integration

### CDK Constructs

- [Secrets Manager Module](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_secretsmanager-readme.html)
- [Secret Creation](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_secretsmanager.Secret.html)
- [Rotation Configuration](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_secretsmanager.RotationSchedule.html)
- [Common Patterns](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_secretsmanager.SecretRotation.html)

## Monitoring and Auditing

### CloudWatch Integration

- [Monitoring with CloudWatch](https://docs.aws.amazon.com/secretsmanager/latest/userguide/monitoring-cloudwatch.html)
- [CloudWatch Metrics](https://docs.aws.amazon.com/secretsmanager/latest/userguide/monitoring-cloudwatch-metrics.html)
- [CloudWatch Alarms](https://docs.aws.amazon.com/secretsmanager/latest/userguide/monitoring-cloudwatch-alarms.html)

### Logging and Auditing

- [CloudTrail Integration](https://docs.aws.amazon.com/secretsmanager/latest/userguide/monitoring-cloudtrail.html)
- [Audit Events](https://docs.aws.amazon.com/secretsmanager/latest/userguide/monitoring-cloudtrail-records.html)
- [Compliance Validation](https://docs.aws.amazon.com/secretsmanager/latest/userguide/compliance-validation.html)

## Tools and Utilities

### AWS CLI Commands

- [create-secret](https://docs.aws.amazon.com/cli/latest/reference/secretsmanager/create-secret.html)
- [get-secret-value](https://docs.aws.amazon.com/cli/latest/reference/secretsmanager/get-secret-value.html)
- [rotate-secret](https://docs.aws.amazon.com/cli/latest/reference/secretsmanager/rotate-secret.html)
- [list-secrets](https://docs.aws.amazon.com/cli/latest/reference/secretsmanager/list-secrets.html)

### AWS SDK Examples

- [JavaScript/Node.js](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-secrets-manager/index.html)
- [Python (Boto3)](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/secretsmanager.html)
- [Java](https://docs.aws.amazon.com/AWSJavaSDK/latest/javadoc/com/amazonaws/services/secretsmanager/AWSSecretsManager.html)
- [.NET](https://docs.aws.amazon.com/sdkfornet/v3/apidocs/items/SecretsManager/NSecretsManager.html)

## Best Practices and Patterns

### Architecture Patterns

- [Application Integration](https://docs.aws.amazon.com/secretsmanager/latest/userguide/best-practices.html#best-practices-apps)
- [Cross-Region Replication](https://docs.aws.amazon.com/secretsmanager/latest/userguide/create-manage-multi-region-secrets.html)
- [High Availability](https://docs.aws.amazon.com/secretsmanager/latest/userguide/best-practices.html#best-practices-high-availability)
- [Disaster Recovery](https://docs.aws.amazon.com/secretsmanager/latest/userguide/best-practices.html#best-practices-disaster-recovery)

### Cost Optimization

- [Pricing Overview](https://aws.amazon.com/secrets-manager/pricing/)
- [Cost Management](https://docs.aws.amazon.com/secretsmanager/latest/userguide/best-practices.html#best-practices-cost)
- [API Call Optimization](https://docs.aws.amazon.com/secretsmanager/latest/userguide/best-practices.html#best-practices-api-calls)

## Tutorials and Workshops

- [Getting Started Tutorial](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html)
- [Database Credentials Tutorial](https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_database-rotate.html)
- [AWS Workshop Studio](https://workshops.aws/)
- [Sample Applications](https://github.com/aws-samples/aws-secrets-manager-examples)

## Community Resources

- [AWS Security Blog](https://aws.amazon.com/blogs/security/category/security-identity-compliance/aws-secrets-manager/)
- [AWS re:Post - Secrets Manager](https://repost.aws/tags/TAmo05QHWFYw7VhKYGNRbrdg/aws-secrets-manager)
- [GitHub Examples](https://github.com/aws-samples/aws-secrets-manager-rotation-examples)
