# API Gateway Integration - Hands-on Lab

[DIAGRAM: API Gateway Hands-on Architecture]
Instructions for draw.io:

1. Create a new diagram using the AWS Architecture 2023 template
2. Use the following AWS symbols from the symbol pack:
   - AWS API Gateway icon
   - AWS Lambda icon
   - AWS DynamoDB icon
   - AWS IAM icon
   - AWS CloudWatch icon
3. Layout:
   - Place API Gateway at the center
   - Add Lambda functions on the left
   - Place DynamoDB on the right
   - Show security components above
4. Use AWS's standard connector arrows to show data flow
5. Add clear labels for each component
6. Use AWS's standard color scheme:
   - Blue for AWS services
   - Green for API Gateway components
   - Gray for infrastructure elements

## Prerequisites

- AWS CDK and AWS CLI configured
- Postman or similar API testing tool
- Node.js installed
- Basic understanding of REST APIs

## Lab Steps

### 1. Create API Infrastructure

Create a new file `lib/api-stack.ts`:

```typescript:lib/api-stack.ts
import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class ApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create DynamoDB table
    const table = new dynamodb.Table(this, 'ItemsTable', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Create Lambda functions
    const getItemsFunction = new lambda.Function(this, 'GetItemsFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('src/get-items'),
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    const createItemFunction = new lambda.Function(this, 'CreateItemFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('src/create-item'),
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    // Grant permissions
    table.grantReadData(getItemsFunction);
    table.grantWriteData(createItemFunction);

    // Create API Gateway
    const api = new apigateway.RestApi(this, 'ItemsApi', {
      restApiName: 'Items Service',
      description: 'This is a simple API Gateway with Lambda integration',
      deployOptions: {
        stageName: 'dev',
        metricsEnabled: true,
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
        dataTraceEnabled: true,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    // Create API resources and methods
    const items = api.root.addResource('items');

    items.addMethod('GET', new apigateway.LambdaIntegration(getItemsFunction, {
      proxy: true,
      requestTemplates: {
        'application/json': '{ "statusCode": 200 }',
      },
    }));

    items.addMethod('POST', new apigateway.LambdaIntegration(createItemFunction, {
      proxy: true,
      requestTemplates: {
        'application/json': '{ "statusCode": 200 }',
      },
    }));

    // Add API key requirement
    const plan = api.addUsagePlan('UsagePlan', {
      name: 'Basic',
      throttle: {
        rateLimit: 10,
        burstLimit: 2,
      },
    });

    const key = api.addApiKey('ApiKey');
    plan.addApiKey(key);
    plan.addApiStage({
      stage: api.deploymentStage,
    });

    // Outputs
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
    });

    new cdk.CfnOutput(this, 'ApiKey', {
      value: key.keyId,
    });
  }
}
```

### 2. Create Lambda Function Handlers

1. Create GET items handler:

```typescript:src/get-items/index.ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const ddbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddbClient);

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const result = await docClient.send(new ScanCommand({
      TableName: process.env.TABLE_NAME,
    }));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        items: result.Items,
      }),
    };
  } catch (error) {
    console.error('Error fetching items:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: 'Error fetching items',
      }),
    };
  }
};
```

2. Create POST item handler:

```typescript:src/create-item/index.ts
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'crypto';

const ddbClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(ddbClient);

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const requestBody = JSON.parse(event.body || '{}');
    const item = {
      id: randomUUID(),
      ...requestBody,
      createdAt: new Date().toISOString(),
    };

    await docClient.send(new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: item,
    }));

    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: 'Item created successfully',
        item,
      }),
    };
  } catch (error) {
    console.error('Error creating item:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: 'Error creating item',
      }),
    };
  }
};
```

### 3. Deploy and Test

1. Deploy the stack:

```bash
cdk deploy ApiStack --profile your-profile-name
```

2. Get API key value:

```bash
aws apigateway get-api-key \
  --api-key $(aws cloudformation describe-stacks \
    --stack-name ApiStack \
    --query 'Stacks[0].Outputs[?OutputKey==`ApiKey`].OutputValue' \
    --output text) \
  --include-value \
  --query 'value' \
  --output text \
  --profile your-profile-name
```

3. Test the API:

```bash
# Get API URL from CloudFormation outputs
export API_URL=$(aws cloudformation describe-stacks \
  --stack-name ApiStack \
  --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' \
  --output text \
  --profile your-profile-name)

# Test GET endpoint
curl -X GET $API_URL/items \
  -H "x-api-key: your-api-key"

# Test POST endpoint
curl -X POST $API_URL/items \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-api-key" \
  -d '{"name": "Test Item", "description": "This is a test item"}'
```

## Validation Steps

1. API Configuration

   - [ ] API created successfully
   - [ ] Lambda integration working
   - [ ] CORS configured
   - [ ] API key working

2. Endpoints

   - [ ] GET endpoint returning items
   - [ ] POST endpoint creating items
   - [ ] Error handling working
   - [ ] CORS headers present

3. Security
   - [ ] API key required
   - [ ] Throttling working
   - [ ] IAM permissions correct
   - [ ] CloudWatch logs available

## Troubleshooting

1. API Issues

   - Check API Gateway logs
   - Verify Lambda permissions
   - Check CORS configuration
   - Review API key setup

2. Lambda Issues

   - Check CloudWatch logs
   - Verify environment variables
   - Check IAM roles
   - Test function locally

3. Integration Issues
   - Review integration type
   - Check mapping templates
   - Verify response format
   - Check timeout settings

## Cleanup

Remove the stack:

```bash
cdk destroy ApiStack --profile your-profile-name
```

[DIAGRAM: API Gateway Setup Flow]
Instructions for draw.io:

1. Create a new diagram using the AWS Architecture 2023 template
2. Use the following AWS symbols from the symbol pack:
   - AWS API Gateway icon
   - AWS Lambda icon
   - AWS IAM icon
   - AWS CloudWatch icon
3. Layout:
   - Create a flowchart using AWS's standard flowchart shapes
   - Use diamond shapes for decision points
   - Use AWS's standard connector arrows
4. Add process boxes for:
   - API Creation
   - Integration Configuration
   - Security Setup
   - Deployment Configuration
5. Use AWS's standard color scheme for all elements
6. Add clear labels for each step in the flow

## Creating API Gateway Resources
