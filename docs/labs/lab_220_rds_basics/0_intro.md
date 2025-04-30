# RDS Basics with AWS CDK

## Overview

Amazon Relational Database Service (RDS) is a managed database service that makes it easy to set up, operate, and scale relational databases in the cloud. In this lab, you'll learn how to create and manage RDS instances using AWS CDK.

[DIAGRAM: RDS Overview]
Instructions for draw.io:

1. Create a new diagram using the AWS Architecture 2023 template
2. Use the following AWS symbols from the symbol pack:
   - AWS RDS icon
   - AWS VPC icon
   - AWS CloudWatch icon
   - AWS KMS icon
   - AWS Secrets Manager icon
3. Layout:
   - Place RDS at the center
   - Add database instances around it
   - Place supporting services on the right
   - Show security and monitoring on the left
4. Use AWS's standard connector arrows to show relationships
5. Add database visualization with replication flows

## Learning Objectives

- Understand RDS core concepts and features
- Launch and configure an RDS instance
- Implement security best practices
- Set up monitoring and backups
- Connect to your database securely

## Core Concepts

### Database Engines

RDS supports multiple database engines:

- Amazon Aurora
- MySQL
- PostgreSQL
- MariaDB
- Oracle Database
- SQL Server

Each engine has its own features, versions, and pricing model.

### Instance Classes

RDS offers several instance classes optimized for different use cases:

1. **Standard Classes (db.m classes)**

   - General purpose
   - Balanced compute, memory, and network
   - Example: db.m5.large

2. **Memory Optimized (db.r classes)**

   - High memory to CPU ratio
   - In-memory processing
   - Example: db.r5.large

3. **Burstable Classes (db.t classes)**
   - Cost-effective for variable workloads
   - Ability to burst CPU when needed
   - Example: db.t3.micro

### Storage Types

1. **General Purpose (gp2/gp3)**

   - Default for most workloads
   - Balance of price and performance
   - 3 IOPS/GB baseline performance

2. **Provisioned IOPS (io1)**

   - High-performance requirements
   - Consistent I/O performance
   - Up to 64,000 IOPS per database

3. **Magnetic (standard)**
   - Legacy storage type
   - Not recommended for new deployments

### High Availability Features

1. **Multi-AZ Deployment**

   ```
   Primary AZ           Standby AZ
   ┌──────────┐        ┌──────────┐
   │ Primary  │        │ Standby  │
   │ Instance │───────▶│ Instance │
   └──────────┘        └──────────┘
   ```

   - Synchronous replication
   - Automatic failover
   - Enhanced durability

2. **Read Replicas**
   ```
   Primary Instance
   ┌──────────┐
   │ Master   │
   │ Database │
   └──────────┘
         │
         ▼
   ┌──────────┐ ┌──────────┐ ┌──────────┐
   │  Read    │ │  Read    │ │  Read    │
   │ Replica  │ │ Replica  │ │ Replica  │
   └──────────┘ └──────────┘ └──────────┘
   ```
   - Asynchronous replication
   - Scale read operations
   - Cross-region capability

### Security Features

1. **Network Security**

   - VPC placement
   - Security groups
   - No direct internet access

2. **Access Control**

   - IAM database authentication
   - Database user management
   - SSL/TLS encryption

3. **Encryption**
   - At-rest encryption using KMS
   - In-transit encryption using SSL
   - Automated certificate rotation

### Backup and Recovery

1. **Automated Backups**

   - Daily full backup
   - Transaction logs every 5 minutes
   - Point-in-time recovery
   - Configurable retention (0-35 days)

2. **Manual Snapshots**
   - User-initiated backups
   - Retained until explicitly deleted
   - Cross-region copy capability

### Monitoring and Maintenance

1. **CloudWatch Integration**

   - Performance metrics
   - Storage metrics
   - Connection metrics

2. **Enhanced Monitoring**
   - OS metrics
   - Process metrics
   - Real-time monitoring

## Best Practices

1. **Security**

   - Use security groups effectively
   - Enable encryption at rest
   - Use IAM authentication when possible
   - Regular password rotation
   - SSL/TLS for connections

2. **Performance**

   - Choose appropriate instance class
   - Monitor and adjust storage
   - Use read replicas for read scaling
   - Regular maintenance windows

3. **Backup and Recovery**

   - Enable automated backups
   - Set appropriate retention period
   - Regular snapshot strategy
   - Test recovery procedures

4. **Cost Optimization**
   - Right-size instances
   - Use appropriate storage type
   - Consider reserved instances
   - Monitor and adjust resources

## What's Next

In the hands-on section, you'll:

- Launch an RDS instance
- Configure security and networking
- Set up monitoring and backups
- Connect to your database
- Implement high availability features

[DIAGRAM: RDS Operations Flow]
Instructions for draw.io:

1. Create a new diagram using the AWS Architecture 2023 template
2. Use the following AWS symbols from the symbol pack:
   - AWS RDS icon
   - AWS CloudWatch icon
   - AWS Backup icon
   - AWS VPC icon
   - AWS IAM icon
3. Layout:
   - Create a flowchart using AWS's standard flowchart shapes
   - Use diamond shapes for decision points
   - Use AWS's standard connector arrows
4. Add process boxes for:
   - Instance Creation
   - Database Configuration
   - Backup and Restore
   - Monitoring and Maintenance
5. Use AWS's standard color scheme for all elements
