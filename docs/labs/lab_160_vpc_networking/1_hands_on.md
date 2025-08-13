# VPC Networking - Hands-on Lab

[DIAGRAM: VPC Hands-on Architecture]

```mermaid
flowchart TD
    subgraph VPC["VPC (10.0.0.0/16)"]
        subgraph Public["Public Subnets"]
            PS1["Public Subnet 1\n(10.0.1.0/24)"]
            PS2["Public Subnet 2\n(10.0.2.0/24)"]
        end

        subgraph Private["Private Subnets"]
            PR1["Private Subnet 1\n(10.0.3.0/24)"]
            PR2["Private Subnet 2\n(10.0.4.0/24)"]
        end

        IGW[Internet Gateway]
        NAT[NAT Gateway]

        subgraph EC2["EC2 Instances"]
            PI[Public Instance]
            PRI[Private Instance]
        end

        subgraph SG["Security Groups"]
            PSG[Public SG]
            PRSG[Private SG]
        end

        CW[CloudWatch]
    end

    Internet((Internet)) <--> IGW
    IGW --> PS1
    IGW --> PS2
    PS1 --> NAT
    PS2 --> NAT
    NAT --> PR1
    NAT --> PR2

    PS1 --> PI
    PS2 --> PI
    PR1 --> PRI
    PR2 --> PRI

    PI --> PSG
    PRI --> PRSG

    PSG --> CW
    PRSG --> CW
```

## Prerequisites

> Tip: Set the workshop region (Frankfurt)
```bash
export AWS_REGION=eu-central-1
```

> Tip: Set an AWS profile for this shell to avoid repeating profile flags

```bash
export AWS_PROFILE=your-profile-name
```

- Completed the CDK Foundations lab
- AWS CDK and CLI configured with appropriate permissions

## Lab Steps

### 1. Create a Multi-AZ VPC

Update your stack file with the following code:

```typescript
import * as cdk from "aws-cdk-lib"
import { CfnOutput, Stack, StackProps } from "aws-cdk-lib"
import {
  Vpc,
  SubnetType,
  InstanceType,
  InstanceClass,
  InstanceSize,
  SecurityGroup,
  Peer,
  Port,
  Instance,
  MachineImage,
  UserData,
  GatewayVpcEndpointAwsService,
  FlowLog,
  FlowLogResourceType,
  FlowLogDestination,
} from "aws-cdk-lib/aws-ec2"
import * as logs from "aws-cdk-lib/aws-logs"
import { Construct } from "constructs"

export class AwsFundamentalsWorkshopLabsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    // Create a VPC with public and private subnets across 2 AZs
    const vpc = new Vpc(this, "WorkshopVPC", {
      maxAzs: 2,
      natGateways: 1,
      subnetConfiguration: [
        {
          name: "Public",
          subnetType: SubnetType.PUBLIC,
          cidrMask: 24,
        },
        {
          name: "Private",
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: 24,
        },
      ],
    })

    // Create security group for public instances
    const publicSG = new SecurityGroup(this, "PublicSecurityGroup", {
      vpc,
      description: "Security group for public instances",
      allowAllOutbound: true,
    })

    publicSG.addIngressRule(
      Peer.anyIpv4(),
      Port.tcp(80),
      "Allow HTTP access from anywhere"
    )

    // Create security group for private instances
    const privateSG = new SecurityGroup(this, "PrivateSecurityGroup", {
      vpc,
      description: "Security group for private instances",
      allowAllOutbound: true,
    })

    privateSG.addIngressRule(
      publicSG,
      Port.tcp(80),
      "Allow HTTP access from public security group"
    )

    // Create a public EC2 instance
    const publicInstance = new Instance(this, "PublicInstance", {
      vpc,
      vpcSubnets: {
        subnetType: SubnetType.PUBLIC,
      },
      instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
      machineImage: MachineImage.latestAmazonLinux2023(),
      securityGroup: publicSG,
    })

    // Create a private EC2 instance
    const privateInstance = new Instance(this, "PrivateInstance", {
      vpc,
      vpcSubnets: {
        subnetType: SubnetType.PRIVATE_WITH_EGRESS,
      },
      instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
      machineImage: MachineImage.latestAmazonLinux2023(),
      securityGroup: privateSG,
    })

    // Output the VPC ID and instance IDs for later steps
    new CfnOutput(this, "VpcId", {
      value: vpc.vpcId,
      description: "VPC ID",
      exportName: "WorkshopVpcId",
    })

    // Output the public instance ID
    new CfnOutput(this, "PublicInstanceId", {
      value: publicInstance.instanceId,
      description: "Public Instance ID",
    })

    // Output the private instance ID
    new CfnOutput(this, "PrivateInstanceId", {
      value: privateInstance.instanceId,
      description: "Private Instance ID",
    })
  }
}
```

Deploy the stack:

```bash
cdk deploy
```

### 2. Explore VPC Components

After deployment, explore your VPC in the AWS Console:

1. **Navigate to VPC Dashboard**

   - Go to the VPC service in AWS Console
   - Find your newly created VPC
   - Examine the following components:
     - Subnets
     - Route Tables
     - Internet Gateway
     - NAT Gateway

2. **Verify Subnet Configuration**
   - Confirm public subnets have route to Internet Gateway
   - Verify private subnets have route to NAT Gateway
   - Check CIDR ranges match expected values

### 3. Test Network Connectivity

Let's verify our network setup works as expected:

1. **Connect to Public Instance**

```bash
# Use AWS Systems Manager Session Manager
aws ssm start-session \
    --target your-public-instance-id \

```

2. **Test Internet Connectivity**

```bash
# From public instance
ping 8.8.8.8
curl http://example.com
```

3. **Connect to Private Instance**

```bash
# Use Systems Manager again
aws ssm start-session \
    --target your-private-instance-id \

```

4. **Test NAT Gateway**

```bash
# From private instance
ping 8.8.8.8
curl http://example.com
```

### 4. Implement VPC Endpoints

Add an S3 VPC Endpoint to allow private instances to access S3 without using the NAT Gateway:

```typescript
// Add to your stack
const s3Endpoint = vpc.addGatewayEndpoint("S3Endpoint", {
  service: GatewayVpcEndpointAwsService.S3,
})
```

### 5. Monitor VPC Traffic

Enable VPC Flow Logs to monitor network traffic:

```typescript
// Add to your stack
const logGroup = new logs.LogGroup(this, "VPCFlowLogs")

new FlowLog(this, "FlowLog", {
  resourceType: FlowLogResourceType.fromVpc(vpc),
  destination: FlowLogDestination.toCloudWatchLogs(logGroup),
})
```

### 6. Test Security Groups

Verify security group rules are working:

1. **Test Public Access**

```bash
# From your local machine
curl http://public-instance-ip
```

2. **Test Private Access**

```bash
# From public instance
curl http://private-instance-ip
```

## Validation Steps

After completing the lab, verify that:

1. ✅ VPC is created with correct CIDR range
2. ✅ Public and private subnets are created in multiple AZs
3. ✅ Internet Gateway is attached to VPC
4. ✅ NAT Gateway is created and working
5. ✅ Security groups are properly configured
6. ✅ Instances can access the internet as expected
7. ✅ VPC endpoints are working correctly

## Troubleshooting

Common issues and solutions:

1. **Connectivity Issues**

   - Check route tables
   - Verify security group rules
   - Confirm NAT Gateway is running
   - Test with ping and curl commands

2. **Instance Access Problems**

   - Verify Systems Manager setup
   - Check instance IAM roles
   - Confirm security group permissions
   - Review VPC endpoints

3. **Deployment Failures**
   - Check CDK synthesis output
   - Review CloudFormation events
   - Verify IAM permissions
   - Check resource limits

## Best Practices Demonstrated

This lab has implemented several AWS networking best practices:

1. **Security**

   - Isolated private subnets
   - Least privilege security groups
   - VPC Flow Logs for monitoring
   - Systems Manager for secure access
   - Note: Inbound examples using 0.0.0.0/0 are for workshop convenience only; scope to known CIDR ranges or SG sources in production, and limit egress.

2. **High Availability**

   - Multi-AZ deployment
   - Redundant subnets
   - Resilient architecture

3. **Cost Optimization**
   - Single NAT Gateway
   - VPC Endpoints for AWS services
   - Appropriate instance sizes

## Next Steps

After completing this lab, you can:

- Implement more complex networking patterns
- Add additional VPC endpoints
- Configure VPC peering
- Implement transit gateways
- Set up site-to-site VPN

## VPC Operations Flow

```mermaid
sequenceDiagram
    participant User
    participant CDK
    participant CloudFormation
    participant VPC
    participant Subnets
    participant Gateways

    User->>CDK: cdk deploy
    CDK->>CloudFormation: Synthesize template
    CloudFormation->>VPC: Create VPC
    VPC->>Subnets: Create public/private subnets
    Subnets->>Gateways: Attach Internet Gateway
    Gateways->>Subnets: Create NAT Gateway
    Subnets->>VPC: Configure route tables
    VPC->>CloudFormation: Resources created
    CloudFormation->>CDK: Deployment complete
    CDK->>User: Stack deployed successfully
```

## VPC Implementation

<!-- 🔄 TEMPORARY MERMAID DIAGRAM - REPLACE WITH MANUAL DRAW.IO: lab_160_vpc_detailed_networking_relationships.drawio.svg -->

```mermaid
flowchart TD
    subgraph "VPC Network Implementation Details"
        subgraph "VPC_MAIN [workshop-vpc: 10.0.0.0/16]"
            subgraph "Subnet Architecture"
                subgraph "AZ-1a Subnets"
                    PUB_1A[Public Subnet 1A<br/>10.0.1.0/24<br/>Route: 0.0.0.0/0 → IGW]
                    PRIV_1A[Private Subnet 1A<br/>10.0.11.0/24<br/>Route: 0.0.0.0/0 → NAT-1A]
                    DB_1A[DB Subnet 1A<br/>10.0.21.0/24<br/>Route: Local Only]
                end

                subgraph "AZ-1b Subnets"
                    PUB_1B[Public Subnet 1B<br/>10.0.2.0/24<br/>Route: 0.0.0.0/0 → IGW]
                    PRIV_1B[Private Subnet 1B<br/>10.0.12.0/24<br/>Route: 0.0.0.0/0 → NAT-1B]
                    DB_1B[DB Subnet 1B<br/>10.0.22.0/24<br/>Route: Local Only]
                end
            end

            subgraph "Gateway Components"
                IGW_MAIN[Internet Gateway<br/>workshop-igw]
                NAT_1A_DETAIL[NAT Gateway 1A<br/>EIP: 203.0.113.1<br/>Subnet: Public-1A]
                NAT_1B_DETAIL[NAT Gateway 1B<br/>EIP: 203.0.113.2<br/>Subnet: Public-1B]
            end
        end

        subgraph "Security Layer Implementation"
            subgraph "Security Groups"
                SG_ALB_DETAIL[ALB Security Group<br/>sg-alb-workshop<br/>Inbound: 80,443 from 0.0.0.0/0<br/>Outbound: All to App SG]

                SG_APP_DETAIL[Application Security Group<br/>sg-app-workshop<br/>Inbound: 8080 from ALB SG<br/>Inbound: 22 from Bastion SG<br/>Outbound: 3306 to DB SG]

                SG_DB_DETAIL[Database Security Group<br/>sg-db-workshop<br/>Inbound: 3306 from App SG<br/>Outbound: None]

                SG_BASTION_DETAIL[Bastion Security Group<br/>sg-bastion-workshop<br/>Inbound: 22 from Corporate<br/>Outbound: 22 to App SG]
            end

            subgraph "Network ACLs"
                NACL_PUB_DETAIL[Public NACL<br/>nacl-public-workshop<br/>100: Allow HTTP In<br/>110: Allow HTTPS In<br/>120: Allow SSH In<br/>*: Deny All]

                NACL_PRIV_DETAIL[Private NACL<br/>nacl-private-workshop<br/>100: Allow App Port In<br/>110: Allow SSH In<br/>120: Allow DB Out<br/>*: Deny All]

                NACL_DB_DETAIL[Database NACL<br/>nacl-database-workshop<br/>100: Allow MySQL In<br/>*: Deny All]
            end
        end

        subgraph "Route Table Details"
            RT_PUB_DETAIL[Public Route Table<br/>rt-public-workshop<br/>10.0.0.0/16 → Local<br/>0.0.0.0/0 → IGW]

            RT_PRIV_1A_DETAIL[Private Route Table 1A<br/>rt-private-1a-workshop<br/>10.0.0.0/16 → Local<br/>0.0.0.0/0 → NAT-1A]

            RT_PRIV_1B_DETAIL[Private Route Table 1B<br/>rt-private-1b-workshop<br/>10.0.0.0/16 → Local<br/>0.0.0.0/0 → NAT-1B]

            RT_DB_DETAIL[Database Route Table<br/>rt-database-workshop<br/>10.0.0.0/16 → Local<br/>No Internet Route]
        end
    end

    subgraph "Resource Deployment"
        subgraph "Compute Resources"
            ALB_INSTANCE[Application Load Balancer<br/>workshop-alb<br/>Public Subnets<br/>Target: App Instances]

            APP_1A[App Instance 1A<br/>i-app1a<br/>Private Subnet 1A<br/>10.0.11.10]

            APP_1B[App Instance 1B<br/>i-app1b<br/>Private Subnet 1B<br/>10.0.12.10]

            BASTION_INSTANCE[Bastion Host<br/>i-bastion<br/>Public Subnet 1A<br/>10.0.1.10]
        end

        subgraph "Database Resources"
            RDS_PRIMARY[RDS Primary<br/>workshop-db-primary<br/>DB Subnet 1A<br/>10.0.21.10]

            RDS_REPLICA[RDS Read Replica<br/>workshop-db-replica<br/>DB Subnet 1B<br/>10.0.22.10]
        end
    end

    %% Network Flow Relationships
    IGW_MAIN -.->|Internet Access| PUB_1A
    IGW_MAIN -.->|Internet Access| PUB_1B

    NAT_1A_DETAIL -.->|Outbound Internet| PRIV_1A
    NAT_1B_DETAIL -.->|Outbound Internet| PRIV_1B

    %% Route Table Associations
    RT_PUB_DETAIL -.->|Associated| PUB_1A
    RT_PUB_DETAIL -.->|Associated| PUB_1B
    RT_PRIV_1A_DETAIL -.->|Associated| PRIV_1A
    RT_PRIV_1B_DETAIL -.->|Associated| PRIV_1B
    RT_DB_DETAIL -.->|Associated| DB_1A
    RT_DB_DETAIL -.->|Associated| DB_1B

    %% Security Group Assignments
    SG_ALB_DETAIL -.->|Applied to| ALB_INSTANCE
    SG_APP_DETAIL -.->|Applied to| APP_1A
    SG_APP_DETAIL -.->|Applied to| APP_1B
    SG_DB_DETAIL -.->|Applied to| RDS_PRIMARY
    SG_DB_DETAIL -.->|Applied to| RDS_REPLICA
    SG_BASTION_DETAIL -.->|Applied to| BASTION_INSTANCE

    %% NACL Associations
    NACL_PUB_DETAIL -.->|Applied to| PUB_1A
    NACL_PUB_DETAIL -.->|Applied to| PUB_1B
    NACL_PRIV_DETAIL -.->|Applied to| PRIV_1A
    NACL_PRIV_DETAIL -.->|Applied to| PRIV_1B
    NACL_DB_DETAIL -.->|Applied to| DB_1A
    NACL_DB_DETAIL -.->|Applied to| DB_1B

    %% Traffic Flow
    ALB_INSTANCE -->|Port 8080| APP_1A
    ALB_INSTANCE -->|Port 8080| APP_1B
    APP_1A -->|Port 3306| RDS_PRIMARY
    APP_1B -->|Port 3306| RDS_REPLICA
    BASTION_INSTANCE -->|SSH Port 22| APP_1A
    BASTION_INSTANCE -->|SSH Port 22| APP_1B

    %% Database Replication
    RDS_PRIMARY -.->|Async Replication| RDS_REPLICA

    %% Styling
    classDef subnet fill:#569a31,stroke:#232F3E,stroke-width:2px,color:white
    classDef gateway fill:#4B9CD3,stroke:#232F3E,stroke-width:2px,color:white
    classDef security fill:#dd344c,stroke:#232F3E,stroke-width:2px,color:white
    classDef routing fill:#8C4FFF,stroke:#232F3E,stroke-width:2px,color:white
    classDef compute fill:#ff9900,stroke:#232F3E,stroke-width:2px,color:#232F3E
    classDef database fill:#F39C12,stroke:#232F3E,stroke-width:2px,color:#232F3E

    class PUB_1A,PUB_1B,PRIV_1A,PRIV_1B,DB_1A,DB_1B subnet
    class IGW_MAIN,NAT_1A_DETAIL,NAT_1B_DETAIL gateway
    class SG_ALB_DETAIL,SG_APP_DETAIL,SG_DB_DETAIL,SG_BASTION_DETAIL,NACL_PUB_DETAIL,NACL_PRIV_DETAIL,NACL_DB_DETAIL security
    class RT_PUB_DETAIL,RT_PRIV_1A_DETAIL,RT_PRIV_1B_DETAIL,RT_DB_DETAIL routing
    class ALB_INSTANCE,APP_1A,APP_1B,BASTION_INSTANCE compute
    class RDS_PRIMARY,RDS_REPLICA database
```

<!-- End diagram section -->

## Clean Up

When you're finished with this lab, clean up the resources to avoid ongoing charges:

```bash
cdk destroy
```

Confirm the deletion when prompted. This will remove:

- VPC and all subnets
- Internet Gateway and NAT Gateway
- Security Groups and NACLs
- EC2 instances
- VPC Flow Logs

## Next Steps

After completing this lab, you can:

- Implement more complex networking patterns
- Add additional VPC endpoints
- Configure VPC peering
- Implement transit gateways
- Set up site-to-site VPN
