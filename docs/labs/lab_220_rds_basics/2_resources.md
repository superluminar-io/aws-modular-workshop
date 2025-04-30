# RDS Basics - Resources

## Official Documentation

### Core Documentation

- [Amazon RDS User Guide](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html)
- [RDS Best Practices](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_BestPractices.html)
- [RDS Pricing](https://aws.amazon.com/rds/pricing/)

### Database Engines

- [MySQL on Amazon RDS](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_MySQL.html)
- [PostgreSQL on Amazon RDS](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_PostgreSQL.html)
- [Amazon Aurora User Guide](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/CHAP_AuroraOverview.html)

## Instance Management

### Instance Types

- [DB Instance Classes](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.DBInstanceClass.html)
- [Instance Type Selection Guide](https://aws.amazon.com/rds/instance-types/)
- [Burstable Performance Instances](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.DBInstanceClass.html#Concepts.DBInstanceClass.BurstableClasses)

### Storage

- [Amazon RDS Storage Types](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Storage.html)
- [Storage Performance Best Practices](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_BestPractices.html#CHAP_BestPractices.Performance.Storage)
- [Storage Autoscaling](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIOPS.StorageTypes.html#USER_PIOPS.Autoscaling)

## Security

### Network Security

- [Security Groups for RDS](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Overview.RDSSecurityGroups.html)
- [VPC and RDS](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_VPC.html)
- [Encryption in Transit](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL.html)

### Access Management

- [IAM Database Authentication](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.html)
- [Password Management](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Passwords.html)
- [Secrets Manager Integration](https://docs.aws.amazon.com/secretsmanager/latest/userguide/integrating_how-services-use-secrets_rds.html)

## High Availability

### Multi-AZ Deployments

- [Multi-AZ Overview](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html)
- [Failover Process](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html#Concepts.MultiAZ.Failover)
- [Multi-AZ Best Practices](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_BestPractices.html#CHAP_BestPractices.HAMultiAZ)

### Read Replicas

- [Read Replica Overview](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html)
- [Cross-Region Read Replicas](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.XRgn.html)
- [Promoting Read Replicas](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html#USER_ReadRepl.Promote)

## Monitoring and Maintenance

### CloudWatch Integration

- [RDS CloudWatch Metrics](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/MonitoringOverview.html#monitoring-cloudwatch)
- [Enhanced Monitoring](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_Monitoring.OS.html)
- [Performance Insights](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PerfInsights.html)

### Backup and Recovery

- [Automated Backups](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithAutomatedBackups.html)
- [Manual Snapshots](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_CreateSnapshot.html)
- [Point-in-Time Recovery](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html)

## AWS CDK and RDS

### CDK Documentation

- [RDS CDK Module](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_rds-readme.html)
- [RDS Construct Library](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_rds.DatabaseInstance.html)
- [CDK RDS Examples](https://github.com/aws-samples/aws-cdk-examples/tree/master/typescript/rds)

## Tools and Utilities

### AWS CLI

- [RDS CLI Reference](https://docs.aws.amazon.com/cli/latest/reference/rds/index.html)
- [RDS API Reference](https://docs.aws.amazon.com/AmazonRDS/latest/APIReference/Welcome.html)
- [AWS Database Blog](https://aws.amazon.com/blogs/database/)

### Database Tools

- [MySQL Workbench](https://www.mysql.com/products/workbench/)
- [pgAdmin](https://www.pgadmin.org/)
- [DBeaver](https://dbeaver.io/)

## Troubleshooting

### Common Issues

- [Connection Issues](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Troubleshooting.html#CHAP_Troubleshooting.Connecting)
- [Performance Issues](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Troubleshooting.html#CHAP_Troubleshooting.Performance)
- [Replication Issues](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Troubleshooting.html#CHAP_Troubleshooting.Replication)

### Support Resources

- [AWS re:Post RDS Forum](https://repost.aws/tags/TAF8-XUqojTsadH5jSz3IfFg/amazon-relational-database-service-amazon-rds)
- [AWS Support Center](https://support.console.aws.amazon.com/)
- [RDS Service Health Dashboard](https://health.aws.amazon.com/health/status)
