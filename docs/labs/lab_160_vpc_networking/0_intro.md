# VPC Networking with AWS CDK

## Overview

Amazon Virtual Private Cloud (VPC) is a service that lets you launch AWS resources in a logically isolated virtual network that you define. In this lab, you'll learn how to create and manage VPCs using AWS CDK.

[DIAGRAM: VPC Overview]

<!-- 🔄 TEMPORARY MERMAID DIAGRAM - REPLACE WITH MANUAL DRAW.IO: lab_160_vpc_complex_network_topology.drawio.svg -->

```mermaid
flowchart TB
    subgraph "Internet & External"
        INTERNET[Internet]
        CORPORATE[Corporate Network<br/>On-Premises]
    end

    subgraph "AWS Global Infrastructure"
        subgraph "Availability Zone A"
            subgraph "VPC_A [VPC - 10.0.0.0/16]"
                subgraph "Public Subnet A"
                    PUB_A[Public Subnet<br/>10.0.1.0/24]
                    IGW[Internet Gateway]
                    NAT_A[NAT Gateway]
                    BASTION_A[Bastion Host<br/>EC2]
                end

                subgraph "Private Subnet A"
                    PRIV_A[Private Subnet<br/>10.0.11.0/24]
                    APP_A[Application Servers<br/>EC2]
                    LAMBDA_A[Lambda Functions<br/>VPC Enabled]
                end

                subgraph "Database Subnet A"
                    DB_A[Database Subnet<br/>10.0.21.0/24]
                    RDS_A[RDS Instance<br/>Primary]
                end
            end
        end

        subgraph "Availability Zone B"
            subgraph "VPC_B [Same VPC - 10.0.0.0/16]"
                subgraph "Public Subnet B"
                    PUB_B[Public Subnet<br/>10.0.2.0/24]
                    NAT_B[NAT Gateway]
                    ALB[Application Load Balancer]
                end

                subgraph "Private Subnet B"
                    PRIV_B[Private Subnet<br/>10.0.12.0/24]
                    APP_B[Application Servers<br/>EC2]
                    ECS_B[ECS Tasks<br/>Fargate]
                end

                subgraph "Database Subnet B"
                    DB_B[Database Subnet<br/>10.0.22.0/24]
                    RDS_B[RDS Instance<br/>Read Replica]
                end
            end
        end
    end

    subgraph "Network Security & Routing"
        subgraph "Route Tables"
            RT_PUB[Public Route Table<br/>0.0.0.0/0 → IGW]
            RT_PRIV_A[Private Route Table A<br/>0.0.0.0/0 → NAT-A]
            RT_PRIV_B[Private Route Table B<br/>0.0.0.0/0 → NAT-B]
            RT_DB[Database Route Table<br/>Local VPC Only]
        end

        subgraph "Security Groups"
            SG_WEB[Web Security Group<br/>80, 443 from 0.0.0.0/0]
            SG_APP[App Security Group<br/>8080 from Web SG]
            SG_DB[Database Security Group<br/>3306 from App SG]
            SG_BASTION[Bastion Security Group<br/>22 from Corp Network]
        end

        subgraph "Network ACLs"
            NACL_PUB[Public NACL<br/>Allow HTTP/HTTPS]
            NACL_PRIV[Private NACL<br/>Allow App Traffic]
            NACL_DB[Database NACL<br/>Allow DB Traffic Only]
        end
    end

    subgraph "VPC Connectivity"
        VPN[VPN Gateway<br/>Corporate Connection]
        DX[Direct Connect<br/>Dedicated Line]
        PEER[VPC Peering<br/>Cross-VPC]
        TGW[Transit Gateway<br/>Hub-Spoke]
    end

    subgraph "DNS & Service Discovery"
        R53[Route 53<br/>Private Hosted Zone]
        RESOLVER[Route 53 Resolver<br/>Hybrid DNS]
    end

    %% Internet Connectivity
    INTERNET --> IGW
    IGW --> PUB_A
    IGW --> PUB_B

    %% Public to Private
    PUB_A --> NAT_A
    PUB_B --> NAT_B
    NAT_A --> PRIV_A
    NAT_B --> PRIV_B

    %% Load Balancer Flow
    ALB --> APP_A
    ALB --> APP_B

    %% Application to Database
    APP_A --> RDS_A
    APP_B --> RDS_B
    LAMBDA_A --> RDS_A
    ECS_B --> RDS_B

    %% Cross-AZ Database Replication
    RDS_A -.->|Replication| RDS_B

    %% Bastion Access
    BASTION_A --> APP_A
    BASTION_A --> RDS_A

    %% Route Table Associations
    RT_PUB -.-> PUB_A
    RT_PUB -.-> PUB_B
    RT_PRIV_A -.-> PRIV_A
    RT_PRIV_B -.-> PRIV_B
    RT_DB -.-> DB_A
    RT_DB -.-> DB_B

    %% Security Group Associations
    SG_WEB -.-> ALB
    SG_APP -.-> APP_A
    SG_APP -.-> APP_B
    SG_DB -.-> RDS_A
    SG_DB -.-> RDS_B
    SG_BASTION -.-> BASTION_A

    %% Corporate Connectivity
    CORPORATE --> VPN
    CORPORATE --> DX
    VPN --> PRIV_A
    DX --> PRIV_A

    %% DNS Resolution
    R53 -.-> PRIV_A
    R53 -.-> PRIV_B
    RESOLVER -.-> CORPORATE

    %% Styling
    classDef public fill:#569a31,stroke:#232F3E,stroke-width:2px,color:white
    classDef private fill:#4B9CD3,stroke:#232F3E,stroke-width:2px,color:white
    classDef database fill:#8C4FFF,stroke:#232F3E,stroke-width:2px,color:white
    classDef security fill:#dd344c,stroke:#232F3E,stroke-width:2px,color:white
    classDef connectivity fill:#ff9900,stroke:#232F3E,stroke-width:2px,color:#232F3E
    classDef external fill:#95a5a6,stroke:#232F3E,stroke-width:2px,color:#232F3E

    class PUB_A,PUB_B,IGW,NAT_A,NAT_B,ALB,BASTION_A public
    class PRIV_A,PRIV_B,APP_A,APP_B,LAMBDA_A,ECS_B private
    class DB_A,DB_B,RDS_A,RDS_B database
    class SG_WEB,SG_APP,SG_DB,SG_BASTION,NACL_PUB,NACL_PRIV,NACL_DB,RT_PUB,RT_PRIV_A,RT_PRIV_B,RT_DB security
    class VPN,DX,PEER,TGW,R53,RESOLVER connectivity
    class INTERNET,CORPORATE external
```

<!-- 🔄 END TEMPORARY DIAGRAM -->

Instructions for draw.io:

1. Create a new diagram using the AWS Architecture 2023 template
2. Use the following AWS symbols from the symbol pack:
   - AWS VPC icon
   - AWS Subnet icon
   - AWS Route Table icon
   - AWS Internet Gateway icon
   - AWS NAT Gateway icon
   - AWS Security Group icon
   - AWS Network ACL icon
3. Layout:
   - Create a detailed component diagram
   - Show relationships between components
   - Include all networking elements
4. Use AWS's standard connector arrows to show:
   - Component relationships
   - Network flow
   - Security boundaries
5. Use AWS's standard color scheme for all elements
6. Add clear labels for each component and relationship

## Learning Objectives

- Understand VPC core concepts and components
- Design and implement a VPC with public and private subnets
- Configure routing and network access controls
- Implement security best practices for network architecture
- Use AWS CDK to create and manage VPC resources

## Core Concepts

### VPC Components

1. **Virtual Private Cloud (VPC)**

   - Logically isolated section of AWS Cloud
   - Defined IP address range (CIDR block)
   - Regional resource that can span multiple Availability Zones

2. **Subnets**

   - Segments of VPC IP address ranges
   - Created in specific Availability Zones
   - Can be public (internet-accessible) or private
   - Used to group resources based on security and operational needs

3. **Route Tables**

   - Control traffic flow between subnets
   - Define routes for network traffic
   - Associated with specific subnets

4. **Internet Gateway (IGW)**

   - Allows communication between VPC and internet
   - Provides a target for internet-routable traffic
   - Essential for public subnets

5. **NAT Gateway**
   - Allows private subnet resources to access internet
   - Prevents inbound connections from internet
   - Provides secure outbound connectivity

### Network Access Controls

1. **Security Groups**

   - Virtual firewalls for resources
   - Control inbound and outbound traffic
   - Stateful (return traffic automatically allowed)
   - Example:
     ```json
     {
       "Type": "AWS::EC2::SecurityGroup",
       "Properties": {
         "GroupDescription": "Allow web traffic",
         "SecurityGroupIngress": [
           {
             "IpProtocol": "tcp",
             "FromPort": 80,
             "ToPort": 80,
             "CidrIp": "0.0.0.0/0"
           }
         ]
       }
     }
     ```

2. **Network ACLs (NACLs)**
   - Network-level firewall for subnets
   - Control traffic in and out of subnets
   - Stateless (return traffic must be explicitly allowed)
   - Processed in order based on rule numbers

### IP Addressing and CIDR Blocks

1. **CIDR Notation**

   - Method for representing IP address ranges
   - Example: 10.0.0.0/16 (65,536 addresses)
   - Common VPC sizes:
     - /16: 65,536 addresses
     - /20: 4,096 addresses
     - /24: 256 addresses

2. **Subnet Sizing**
   - Plan for future growth
   - Reserve space for AWS services
   - Consider high availability requirements

### VPC Design Patterns

1. **Public-Private Architecture**

   ```
   VPC (10.0.0.0/16)
   ├── Public Subnet (10.0.1.0/24)
   │   ├── Internet Gateway
   │   └── Public Resources (Load Balancers, Bastion Hosts)
   └── Private Subnet (10.0.2.0/24)
       ├── NAT Gateway
       └── Private Resources (Applications, Databases)
   ```

2. **Multi-AZ Design**
   ```
   VPC (10.0.0.0/16)
   ├── AZ-1
   │   ├── Public Subnet (10.0.1.0/24)
   │   └── Private Subnet (10.0.2.0/24)
   └── AZ-2
       ├── Public Subnet (10.0.3.0/24)
       └── Private Subnet (10.0.4.0/24)
   ```

### Connectivity Options

1. **Internet Access**

   - Internet Gateway for public subnets
   - NAT Gateway for private subnets
   - Elastic IPs for static public addressing

2. **VPC Endpoints**

   - Connect to AWS services without internet
   - Interface endpoints (powered by PrivateLink)
   - Gateway endpoints (for S3 and DynamoDB)

3. **VPC Peering**
   - Connect VPCs together
   - Route traffic between VPCs
   - Works across regions and accounts

## Best Practices

1. **Security**

   - Use private subnets for sensitive resources
   - Implement least-privilege access controls
   - Enable VPC Flow Logs for monitoring
   - Use security groups as primary access control

2. **High Availability**

   - Deploy across multiple Availability Zones
   - Use redundant NAT Gateways
   - Implement fault-tolerant architectures

3. **IP Address Management**

   - Plan CIDR ranges carefully
   - Reserve space for future growth
   - Document IP address assignments
   - Use consistent subnet sizing

4. **Cost Optimization**
   - Use VPC endpoints where appropriate
   - Monitor NAT Gateway usage
   - Right-size CIDR blocks
   - Clean up unused resources

## What's Next

In the hands-on section, you'll:

- Create a VPC with public and private subnets
- Configure routing tables and internet access
- Set up security groups and NACLs
- Deploy resources across multiple Availability Zones
- Learn to troubleshoot common networking issues

[DIAGRAM: VPC Network Flow]

```mermaid
flowchart TD
    Traffic[Network Traffic] --> Ingress{Ingress/Egress?}

    Ingress -->|Ingress| SG[Security Group Check]
    Ingress -->|Egress| NACL[NACL Check]

    SG -->|Allow| NACL
    SG -->|Deny| Block1[Block Traffic]

    NACL -->|Allow| RT[Route Table Check]
    NACL -->|Deny| Block2[Block Traffic]

    RT -->|Local| Local[Local VPC Traffic]
    RT -->|Internet| IGW[Internet Gateway]
    RT -->|NAT| NAT[NAT Gateway]

    Local --> Success1[Traffic Delivered]
    IGW --> Success2[Internet Access]
    NAT --> Success3[Outbound Access]

    Block1 --> End[Traffic Blocked]
    Block2 --> End
```

[DIAGRAM: VPC Components]

Instructions for draw.io:

1. Create a new diagram using the AWS Architecture 2023 template
2. Use the following AWS symbols from the symbol pack:
   - AWS VPC icon
   - AWS Subnet icon
   - AWS Route Table icon
   - AWS Internet Gateway icon
   - AWS NAT Gateway icon
   - AWS Security Group icon
   - AWS Network ACL icon
3. Layout:
   - Create a detailed component diagram
   - Show relationships between components
   - Include all networking elements
4. Use AWS's standard connector arrows to show:
   - Component relationships
   - Network flow
   - Security boundaries
5. Use AWS's standard color scheme for all elements
6. Add clear labels for each component and relationship
