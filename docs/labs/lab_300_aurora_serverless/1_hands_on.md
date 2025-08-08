# Aurora Serverless - Hands-on Lab

## Prerequisites

Before starting this lab, ensure you have:

- AWS CDK and AWS CLI configured
- Node.js installed with npm
- Basic SQL knowledge
- Completed VPC Networking lab

## Overview

In this lab, you'll build a production-ready Aurora Serverless database with monitoring, connection pooling, and operational best practices. The architecture includes auto-scaling, performance monitoring, and efficient Lambda integration.

## Lab Steps

### 1. Create Aurora Serverless Infrastructure

Create a comprehensive Aurora stack with monitoring and operational features:

```typescript:lib/aurora-stack.ts
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as actions from 'aws-cdk-lib/aws-cloudwatch-actions';
import { Construct } from 'constructs';

export class AuroraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create VPC for database isolation
    const vpc = new ec2.Vpc(this, 'AuroraVPC', {
      maxAzs: 2,
      natGateways: 1,
      enableDnsHostnames: true,
      enableDnsSupport: true,
    });

    // Security group for Aurora cluster
    const dbSecurityGroup = new ec2.SecurityGroup(this, 'DBSecurityGroup', {
      vpc,
      description: 'Security group for Aurora Serverless cluster',
      allowAllOutbound: false,
    });

    // Allow MySQL access from within VPC
    dbSecurityGroup.addIngressRule(
      ec2.Peer.ipv4(vpc.vpcCidrBlock),
      ec2.Port.tcp(3306),
      'Allow MySQL access from VPC'
    );

    // Create Aurora Serverless cluster
    const cluster = new rds.ServerlessCluster(this, 'WorkshopCluster', {
      engine: rds.DatabaseClusterEngine.auroraMysql({
        version: rds.AuroraMysqlEngineVersion.VER_8_0_MYSQL_3_02_0
      }),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      scaling: {
        minCapacity: rds.AuroraCapacityUnit.ACU_1,
        maxCapacity: rds.AuroraCapacityUnit.ACU_16,
        autoPause: cdk.Duration.minutes(10),
      },
      securityGroups: [dbSecurityGroup],
      defaultDatabaseName: 'workshop',
      enableDataApi: true,
      backupRetention: cdk.Duration.days(7),
      deletionProtection: false,
      clusterIdentifier: 'workshop-aurora-cluster',
    });

    // SNS topic for database alerts
    const alertTopic = new sns.Topic(this, 'DatabaseAlerts', {
      displayName: 'Aurora Workshop Alerts'
    });

    // CloudWatch alarms for operational monitoring
    const cpuAlarm = new cloudwatch.Alarm(this, 'HighCPUAlarm', {
      alarmName: 'aurora-high-cpu',
      alarmDescription: 'Aurora Serverless CPU utilization is high',
      metric: cluster.metricCPUUtilization(),
      threshold: 80,
      evaluationPeriods: 2,
      datapointsToAlarm: 2,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });

    const connectionsAlarm = new cloudwatch.Alarm(this, 'HighConnectionsAlarm', {
      alarmName: 'aurora-high-connections',
      alarmDescription: 'Aurora Serverless connection count is high',
      metric: cluster.metricDatabaseConnections(),
      threshold: 40,
      evaluationPeriods: 2,
      datapointsToAlarm: 2,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });

    const acuAlarm = new cloudwatch.Alarm(this, 'HighACUAlarm', {
      alarmName: 'aurora-high-acu',
      alarmDescription: 'Aurora Serverless ACU utilization is high',
      metric: cluster.metricACUUtilization(),
      threshold: 90,
      evaluationPeriods: 1,
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });

    // Connect alarms to SNS topic
    cpuAlarm.addAlarmAction(new actions.SnsAction(alertTopic));
    connectionsAlarm.addAlarmAction(new actions.SnsAction(alertTopic));
    acuAlarm.addAlarmAction(new actions.SnsAction(alertTopic));

    // Lambda function for database operations with efficient connection pooling
    const dbFunction = new lambda.Function(this, 'DatabaseFunction', {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda/db-operations'),
      environment: {
        SECRET_ARN: cluster.secret?.secretArn || '',
        CLUSTER_ARN: cluster.clusterArn,
        DATABASE_NAME: 'workshop'
      },
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      reservedConcurrentExecutions: 10,
    });

    // Grant Lambda permissions for Data API access
    cluster.grantDataApiAccess(dbFunction);

    // CloudWatch dashboard for monitoring
    const dashboard = new cloudwatch.Dashboard(this, 'AuroraDashboard', {
      dashboardName: 'aurora-serverless-workshop',
    });

    dashboard.addWidgets(
      new cloudwatch.GraphWidget({
        title: 'Aurora CPU Utilization',
        left: [cluster.metricCPUUtilization()],
        width: 12,
        height: 6,
      }),
      new cloudwatch.GraphWidget({
        title: 'Database Connections',
        left: [cluster.metricDatabaseConnections()],
        width: 12,
        height: 6,
      }),
      new cloudwatch.GraphWidget({
        title: 'Aurora Capacity Units (ACU)',
        left: [cluster.metricACUUtilization()],
        width: 12,
        height: 6,
      }),
      new cloudwatch.GraphWidget({
        title: 'Lambda Performance',
        left: [dbFunction.metricDuration()],
        right: [dbFunction.metricErrors()],
        width: 12,
        height: 6,
      })
    );

    // Outputs
    new cdk.CfnOutput(this, 'ClusterArn', {
      value: cluster.clusterArn,
      description: 'Aurora cluster ARN for Data API access'
    });

    new cdk.CfnOutput(this, 'SecretArn', {
      value: cluster.secret?.secretArn || 'No secret created',
      description: 'Secrets Manager ARN for database credentials'
    });

    new cdk.CfnOutput(this, 'LambdaFunctionName', {
      value: dbFunction.functionName,
      description: 'Lambda function name for database operations'
    });

    new cdk.CfnOutput(this, 'AlertTopicArn', {
      value: alertTopic.topicArn,
      description: 'SNS topic ARN for database alerts'
    });

    new cdk.CfnOutput(this, 'DashboardURL', {
      value: `https://${this.region}.console.aws.amazon.com/cloudwatch/home?region=${this.region}#dashboards:name=aurora-serverless-workshop`,
      description: 'CloudWatch dashboard URL'
    });
  }
}
```

### 2. Create Lambda Function for Database Operations

Create the Lambda function source code with proper connection pooling:

```bash
mkdir -p lambda/db-operations
```

Create `lambda/db-operations/index.js`:

```javascript:lambda/db-operations/index.js
const { RDSDataClient, ExecuteStatementCommand, BatchExecuteStatementCommand } = require('@aws-sdk/client-rds-data');

// Create reusable client for connection efficiency
const client = new RDSDataClient({
  region: process.env.AWS_REGION,
  maxAttempts: 3,
  retryMode: 'adaptive'
});

const secretArn = process.env.SECRET_ARN;
const resourceArn = process.env.CLUSTER_ARN;
const database = process.env.DATABASE_NAME;

exports.handler = async (event) => {
  console.log('Database operation requested:', JSON.stringify(event, null, 2));

  try {
    const { operation, data } = event;

    switch (operation) {
      case 'init':
        return await initializeDatabase();
      case 'createUser':
        return await createUser(data);
      case 'getUsers':
        return await getUsers(data?.limit);
      case 'getUserCount':
        return await getUserCount();
      case 'healthCheck':
        return await healthCheck();
      case 'loadTest':
        return await loadTest(data?.count || 10);
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }
  } catch (error) {
    console.error('Database operation failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};

async function initializeDatabase() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_email (email),
      INDEX idx_created_at (created_at)
    )
  `;

  await executeStatement(createTableSQL);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Database initialized successfully',
      table: 'users table created'
    })
  };
}

async function createUser(userData) {
  const { name, email } = userData;

  const sql = 'INSERT INTO users (name, email) VALUES (:name, :email)';
  const parameters = [
    { name: 'name', value: { stringValue: name } },
    { name: 'email', value: { stringValue: email } }
  ];

  const result = await executeStatement(sql, parameters);

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: 'User created successfully',
      userId: result.generatedFields?.[0]?.longValue,
      insertedCount: result.numberOfRecordsUpdated
    })
  };
}

async function getUsers(limit = 50) {
  const sql = 'SELECT id, name, email, created_at FROM users ORDER BY created_at DESC LIMIT :limit';
  const parameters = [
    { name: 'limit', value: { longValue: limit } }
  ];

  const result = await executeStatement(sql, parameters);

  const users = result.records?.map(record => ({
    id: record[0]?.longValue,
    name: record[1]?.stringValue,
    email: record[2]?.stringValue,
    created_at: record[3]?.stringValue
  })) || [];

  return {
    statusCode: 200,
    body: JSON.stringify({
      users,
      count: users.length,
      limit
    })
  };
}

async function getUserCount() {
  const result = await executeStatement('SELECT COUNT(*) as user_count FROM users');

  return {
    statusCode: 200,
    body: JSON.stringify({
      count: result.records?.[0]?.[0]?.longValue || 0,
      timestamp: new Date().toISOString()
    })
  };
}

async function healthCheck() {
  await executeStatement('SELECT 1 as health_check');

  return {
    statusCode: 200,
    body: JSON.stringify({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    })
  };
}

async function loadTest(count) {
  const users = [];
  for (let i = 1; i <= count; i++) {
    users.push({
      name: `Load Test User ${i}`,
      email: `loadtest${i}-${Date.now()}@example.com`
    });
  }

  const sql = 'INSERT INTO users (name, email) VALUES (:name, :email)';
  const parameterSets = users.map(user => [
    { name: 'name', value: { stringValue: user.name } },
    { name: 'email', value: { stringValue: user.email } }
  ]);

  const result = await batchExecuteStatement(sql, parameterSets);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Load test completed`,
      usersCreated: count,
      batchResults: result.updateResults?.length || 0
    })
  };
}

async function executeStatement(sql, parameters = []) {
  const command = new ExecuteStatementCommand({
    secretArn,
    resourceArn,
    database,
    sql,
    parameters,
    includeResultMetadata: true
  });

  return await client.send(command);
}

async function batchExecuteStatement(sql, parameterSets) {
  const command = new BatchExecuteStatementCommand({
    secretArn,
    resourceArn,
    database,
    sql,
    parameterSets
  });

  return await client.send(command);
}
```

Create `lambda/db-operations/package.json`:

```json:lambda/db-operations/package.json
{
  "name": "aurora-db-operations",
  "version": "1.0.0",
  "description": "Aurora Serverless database operations with Data API",
  "main": "index.js",
  "dependencies": {
    "@aws-sdk/client-rds-data": "^3.0.0"
  }
}
```

### 3. Deploy and Initialize the Database

Deploy your Aurora stack and set up the database:

```bash
# Install dependencies for Lambda function
cd lambda/db-operations
npm install
cd ../..

# Deploy the stack
cdk deploy AuroraStack --profile your-profile-name

# Get Lambda function name for testing
export LAMBDA_FUNCTION=$(aws cloudformation describe-stacks \
  --stack-name AuroraStack \
  --query 'Stacks[0].Outputs[?OutputKey==`LambdaFunctionName`].OutputValue' \
  --output text \
  --profile your-profile-name)

echo "Lambda function: $LAMBDA_FUNCTION"
```

Initialize the database schema:

```bash
# Initialize database schema
aws lambda invoke \
  --function-name $LAMBDA_FUNCTION \
  --payload '{"operation":"init"}' \
  --cli-binary-format raw-in-base64-out \
  --profile your-profile-name \
  response.json

echo "Database initialization result:"
cat response.json | jq .
```

### 4. Test Database Operations

Test various database operations to understand the connection pooling:

```bash
# Health check
echo "=== Health Check ==="
aws lambda invoke \
  --function-name $LAMBDA_FUNCTION \
  --payload '{"operation":"healthCheck"}' \
  --cli-binary-format raw-in-base64-out \
  --profile your-profile-name \
  response.json && cat response.json | jq .

# Create some test users
echo -e "\n=== Creating Users ==="
aws lambda invoke \
  --function-name $LAMBDA_FUNCTION \
  --payload '{"operation":"createUser","data":{"name":"Alice Johnson","email":"alice@example.com"}}' \
  --cli-binary-format raw-in-base64-out \
  --profile your-profile-name \
  response.json && cat response.json | jq .

aws lambda invoke \
  --function-name $LAMBDA_FUNCTION \
  --payload '{"operation":"createUser","data":{"name":"Bob Smith","email":"bob@example.com"}}' \
  --cli-binary-format raw-in-base64-out \
  --profile your-profile-name \
  response.json && cat response.json | jq .

# Get user count
echo -e "\n=== User Count ==="
aws lambda invoke \
  --function-name $LAMBDA_FUNCTION \
  --payload '{"operation":"getUserCount"}' \
  --cli-binary-format raw-in-base64-out \
  --profile your-profile-name \
  response.json && cat response.json | jq .

# Get all users
echo -e "\n=== All Users ==="
aws lambda invoke \
  --function-name $LAMBDA_FUNCTION \
  --payload '{"operation":"getUsers","data":{"limit":10}}' \
  --cli-binary-format raw-in-base64-out \
  --profile your-profile-name \
  response.json && cat response.json | jq .
```

### 5. Test Auto-Scaling with Load

Generate load to trigger Aurora auto-scaling:

```bash
# Create load test script
cat > load-test.sh << 'EOF'
#!/bin/bash
set -e

echo "Starting Aurora Serverless load test..."
echo "This will create multiple concurrent Lambda invocations to test scaling"

# Run load test
aws lambda invoke \
  --function-name $LAMBDA_FUNCTION \
  --payload '{"operation":"loadTest","data":{"count":20}}' \
  --cli-binary-format raw-in-base64-out \
  --profile your-profile-name \
  load-response.json

echo "Load test batch 1 completed:"
cat load-response.json | jq .

# Wait a moment then run another batch
sleep 5

aws lambda invoke \
  --function-name $LAMBDA_FUNCTION \
  --payload '{"operation":"loadTest","data":{"count":30}}' \
  --cli-binary-format raw-in-base64-out \
  --profile your-profile-name \
  load-response2.json

echo "Load test batch 2 completed:"
cat load-response2.json | jq .

# Check final user count
echo -e "\nFinal user count:"
aws lambda invoke \
  --function-name $LAMBDA_FUNCTION \
  --payload '{"operation":"getUserCount"}' \
  --cli-binary-format raw-in-base64-out \
  --profile your-profile-name \
  final-count.json && cat final-count.json | jq .

echo "Load test completed!"
EOF

chmod +x load-test.sh
./load-test.sh
```

### 6. Monitor Performance and Scaling

Monitor your Aurora cluster performance in real-time:

```bash
# Subscribe to alerts (replace with your email)
export ALERT_TOPIC=$(aws cloudformation describe-stacks \
  --stack-name AuroraStack \
  --query 'Stacks[0].Outputs[?OutputKey==`AlertTopicArn`].OutputValue' \
  --output text \
  --profile your-profile-name)

aws sns subscribe \
  --topic-arn $ALERT_TOPIC \
  --protocol email \
  --notification-endpoint YOUR_EMAIL_ADDRESS \
  --profile your-profile-name

# Open the CloudWatch dashboard
echo "CloudWatch Dashboard URL:"
aws cloudformation describe-stacks \
  --stack-name AuroraStack \
  --query 'Stacks[0].Outputs[?OutputKey==`DashboardURL`].OutputValue' \
  --output text \
  --profile your-profile-name

# Check current ACU utilization
echo -e "\nCurrent ACU utilization:"
aws cloudwatch get-metric-statistics \
  --namespace AWS/RDS \
  --metric-name ACUUtilization \
  --dimensions Name=DBClusterIdentifier,Value=workshop-aurora-cluster \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Average,Maximum \
  --profile your-profile-name

# Check Lambda function performance
echo -e "\nLambda function performance:"
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Duration \
  --dimensions Name=FunctionName,Value=$LAMBDA_FUNCTION \
  --start-time $(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S) \
  --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
  --period 300 \
  --statistics Average,Maximum \
  --profile your-profile-name
```

## Validation Steps

1. **Infrastructure Setup**

   - [ ] Aurora Serverless cluster created and available
   - [ ] Data API enabled and accessible
   - [ ] Lambda function deployed with proper permissions
   - [ ] CloudWatch dashboard displaying metrics
   - [ ] SNS alerts configured

2. **Database Operations**

   - [ ] Database schema initialized successfully
   - [ ] CRUD operations working via Data API
   - [ ] Connection pooling operating efficiently
   - [ ] Batch operations completing successfully

3. **Monitoring and Scaling**

   - [ ] CloudWatch metrics showing database activity
   - [ ] Auto-scaling events visible in logs
   - [ ] Performance dashboard updating in real-time
   - [ ] Alert notifications configured and tested

4. **Performance Testing**
   - [ ] Load tests triggering scaling events
   - [ ] Lambda functions handling concurrent requests
   - [ ] Database responding under load
   - [ ] Metrics reflecting performance accurately

## Troubleshooting

### Connection Issues

- Verify Data API is enabled on the cluster
- Check Lambda function has proper IAM permissions
- Confirm cluster is in available state
- Review VPC and security group configuration

### Scaling Issues

- Monitor ACU utilization in CloudWatch
- Check scaling configuration settings
- Review capacity limits and thresholds
- Verify auto-pause settings

### Performance Issues

- Check Lambda function timeout settings
- Monitor connection count metrics
- Review query performance in logs
- Consider adjusting ACU limits

## Cleanup

Remove all resources when finished:

```bash
# Delete the stack
cdk destroy AuroraStack --profile your-profile-name

# Clean up local files
rm -f response.json load-response*.json final-count.json
rm -f load-test.sh
```
