# Aurora Serverless - Hands-on Lab

[DIAGRAM: Aurora Hands-on Architecture]
Instructions for draw.io:

1. Create a new diagram using the AWS Architecture 2023 template
2. Use the following AWS symbols from the symbol pack:
   - AWS Aurora icon
   - AWS VPC icon
   - AWS Security Group icon
   - AWS IAM icon
   - AWS Lambda icon
3. Layout:
   - Place VPC as the container
   - Add Aurora cluster inside VPC
   - Place security groups around Aurora
   - Add IAM roles on the side
   - Place Lambda functions outside VPC
4. Use AWS's standard connector arrows to show connections
5. Add subnet visualization within VPC

## Prerequisites

- AWS CDK and AWS CLI configured
- MySQL client installed
- Basic SQL knowledge
- Completed VPC Networking lab

[DIAGRAM: Aurora Setup Flow]
Instructions for draw.io:

1. Create a new diagram using the AWS Architecture 2023 template
2. Use the following AWS symbols from the symbol pack:
   - AWS Aurora icon
   - AWS VPC icon
   - AWS Security Group icon
   - AWS IAM icon
3. Layout:
   - Create a flowchart using AWS's standard flowchart shapes
   - Use diamond shapes for decision points
   - Use AWS's standard connector arrows
4. Add process boxes for:
   - Cluster Creation
   - Capacity Configuration
   - Security Setup
   - Network Configuration
5. Use AWS's standard color scheme for all elements

## Lab Steps

### 1. Create Aurora Serverless Infrastructure

Create a new file `lib/aurora-stack.ts`:

```typescript:lib/aurora-stack.ts
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

export class AuroraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create VPC
    const vpc = new ec2.Vpc(this, 'AuroraVPC', {
      maxAzs: 2,
      natGateways: 1,
    });

    // Create Security Group
    const dbSecurityGroup = new ec2.SecurityGroup(this, 'DBSecurityGroup', {
      vpc,
      description: 'Security group for Aurora Serverless cluster',
      allowAllOutbound: true,
    });

    dbSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(3306),
      'Allow MySQL access'
    );

    // Create Aurora Serverless Cluster
    const cluster = new rds.ServerlessCluster(this, 'AuroraCluster', {
      engine: rds.DatabaseClusterEngine.auroraMysql({
        version: rds.AuroraMysqlEngineVersion.VER_3_03_0
      }),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      scaling: {
        minCapacity: rds.AuroraCapacityUnit.ACU_1,
        maxCapacity: rds.AuroraCapacityUnit.ACU_8,
        autoPause: cdk.Duration.minutes(10),
      },
      securityGroups: [dbSecurityGroup],
      defaultDatabaseName: 'workshop',
      enableDataApi: true,
    });

    // Output cluster endpoints and secrets
    new cdk.CfnOutput(this, 'ClusterEndpoint', {
      value: cluster.clusterEndpoint.hostname,
    });

    new cdk.CfnOutput(this, 'SecretArn', {
      value: cluster.secret?.secretArn || 'No secret created',
    });
  }
}
```

Update your `bin/app.ts`:

```typescript:bin/app.ts
import { AuroraStack } from '../lib/aurora-stack';

// ... existing code ...

new AuroraStack(app, 'AuroraStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
```

Deploy the stack:

```bash
cdk deploy AuroraStack --profile your-profile-name
```

### 2. Create Test Database Schema

Create a new file `scripts/init-database.ts`:

```typescript:scripts/init-database.ts
import { RDSDataClient, ExecuteStatementCommand } from '@aws-sdk/client-rds-data';

const client = new RDSDataClient({});

async function initDatabase() {
  const secretArn = process.env.SECRET_ARN;
  const resourceArn = process.env.CLUSTER_ARN;
  const database = 'workshop';

  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;

  try {
    const command = new ExecuteStatementCommand({
      secretArn,
      resourceArn,
      database,
      sql: createTableSQL,
    });

    await client.send(command);
    console.log('Database schema created successfully');
  } catch (error) {
    console.error('Error creating schema:', error);
  }
}

initDatabase();
```

Run the initialization script:

```bash
export SECRET_ARN=$(aws cloudformation describe-stacks \
  --stack-name AuroraStack \
  --query 'Stacks[0].Outputs[?OutputKey==`SecretArn`].OutputValue' \
  --output text \
  --profile your-profile-name)

export CLUSTER_ARN=$(aws rds describe-db-clusters \
  --query 'DBClusters[?DatabaseName==`workshop`].DBClusterArn' \
  --output text \
  --profile your-profile-name)

ts-node scripts/init-database.ts
```

### 3. Implement Data API Operations

Create a new file `scripts/data-api-operations.ts`:

```typescript:scripts/data-api-operations.ts
import { RDSDataClient, ExecuteStatementCommand } from '@aws-sdk/client-rds-data';

const client = new RDSDataClient({});

async function demonstrateDataAPI() {
  const secretArn = process.env.SECRET_ARN;
  const resourceArn = process.env.CLUSTER_ARN;
  const database = 'workshop';

  try {
    // Insert user
    const insertCommand = new ExecuteStatementCommand({
      secretArn,
      resourceArn,
      database,
      sql: 'INSERT INTO users (name, email) VALUES (:name, :email)',
      parameters: [
        { name: 'name', value: { stringValue: 'Test User' } },
        { name: 'email', value: { stringValue: 'test@example.com' } },
      ],
    });
    await client.send(insertCommand);
    console.log('User inserted');

    // Query users
    const queryCommand = new ExecuteStatementCommand({
      secretArn,
      resourceArn,
      database,
      sql: 'SELECT * FROM users',
    });
    const result = await client.send(queryCommand);
    console.log('Users:', result.records);

  } catch (error) {
    console.error('Error:', error);
  }
}

demonstrateDataAPI();
```

Run the Data API operations:

```bash
ts-node scripts/data-api-operations.ts
```

### 4. Test Auto-scaling

Create a new file `scripts/test-scaling.ts`:

```typescript:scripts/test-scaling.ts
import { RDSDataClient, ExecuteStatementCommand } from '@aws-sdk/client-rds-data';

const client = new RDSDataClient({});

async function generateLoad() {
  const secretArn = process.env.SECRET_ARN;
  const resourceArn = process.env.CLUSTER_ARN;
  const database = 'workshop';

  // Generate some load with multiple concurrent operations
  const operations = Array.from({ length: 50 }, async (_, i) => {
    try {
      const command = new ExecuteStatementCommand({
        secretArn,
        resourceArn,
        database,
        sql: 'INSERT INTO users (name, email) VALUES (:name, :email)',
        parameters: [
          { name: 'name', value: { stringValue: `Load Test User ${i}` } },
          { name: 'email', value: { stringValue: `load${i}@example.com` } },
        ],
      });
      await client.send(command);
      console.log(`Inserted user ${i}`);
    } catch (error) {
      console.error(`Error inserting user ${i}:`, error);
    }
  });

  await Promise.all(operations);
}

generateLoad();
```

Run the scaling test:

```bash
ts-node scripts/test-scaling.ts
```

## Validation Steps

1. Cluster Setup

   - [ ] Cluster is created and available
   - [ ] Data API is enabled
   - [ ] Security group is configured
   - [ ] Secrets are stored in Secrets Manager

2. Database Operations

   - [ ] Schema created successfully
   - [ ] Data API operations working
   - [ ] Auto-scaling triggers working
   - [ ] Connections successful

3. Monitoring
   - [ ] CloudWatch metrics available
   - [ ] Scaling events visible
   - [ ] Performance Insights data
   - [ ] Audit logs configured

## Troubleshooting

1. Connectivity Issues

   - Check security group rules
   - Verify VPC configuration
   - Test Data API access
   - Check credentials

2. Scaling Issues

   - Monitor CloudWatch metrics
   - Check scaling configuration
   - Review capacity settings
   - Check for scaling events

3. Performance Issues
   - Review Performance Insights
   - Check query performance
   - Monitor connection count
   - Review capacity utilization

## Cleanup

Remove the stack:

```bash
cdk destroy AuroraStack --profile your-profile-name
```
