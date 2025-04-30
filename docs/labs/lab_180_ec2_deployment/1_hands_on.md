# EC2 Deployment - Hands-on Lab

[DIAGRAM: EC2 Hands-on Architecture]
Instructions for draw.io:

1. Create a new diagram using the AWS Architecture 2023 template
2. Use the following AWS symbols from the symbol pack:
   - AWS EC2 icon
   - AWS VPC icon
   - AWS Security Group icon
   - AWS IAM icon
   - AWS CloudWatch icon
   - AWS Systems Manager icon
3. Layout:
   - Place VPC at the center
   - Add EC2 instances inside the VPC
   - Show security groups around instances
   - Place IAM roles and policies on the right
   - Add CloudWatch monitoring at the bottom
4. Use AWS's standard connector arrows to show relationships
5. Add network flow visualization with security group rules

Description: A detailed diagram showing the EC2 resources we'll create in this lab. The diagram should:

1. Show the complete architecture:
   - EC2 Instances
   - Security Groups
   - Key Pairs
   - AMIs
   - Network Configuration
2. Illustrate the relationships between components
3. Show the deployment patterns
4. Include example service integrations
   Use AWS's standard color scheme with blue for AWS services and green for EC2 components.

## Prerequisites

This lab builds on the VPC networking concepts. Download the completed VPC lab state to begin:

```bash
curl <S3_URL>/lab-160-completed.zip -o lab-160-completed.zip
unzip lab-160-completed.zip
cd lab-160-completed
npm install
```

## Lab Steps

### 1. Create EC2 Instance

With our VPC infrastructure in place, let's create an EC2 instance:

```typescript
const instance = new ec2.Instance(this, "WebServer", {
  vpc, // Using the existing VPC from lab 160
  instanceType: ec2.InstanceType.of(
    ec2.InstanceClass.T3,
    ec2.InstanceSize.MICRO
  ),
  machineImage: new ec2.AmazonLinuxImage({
    generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
  }),
  // ... rest of EC2 configuration
});
```

### 2. Create an EC2 Instance with CDK

Update your stack file with the following code:

```typescript
import { CfnOutput, Duration, Stack, StackProps } from "aws-cdk-lib";
import {
  Instance,
  InstanceType,
  InstanceClass,
  InstanceSize,
  MachineImage,
  Vpc,
  SecurityGroup,
  Peer,
  Port,
  BlockDeviceVolume,
  EbsDeviceVolumeType,
  UserData,
} from "aws-cdk-lib/aws-ec2";
import { ManagedPolicy, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export class AwsFundamentalsWorkshopLabsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Use existing VPC
    const vpc = Vpc.fromLookup(this, "ExistingVPC", {
      isDefault: false,
      // Add your VPC ID from the previous lab
      vpcId: "vpc-xxxxxxxxxxxxxxxxx",
    });

    // Create security group
    const webServerSG = new SecurityGroup(this, "WebServerSG", {
      vpc,
      description: "Security group for web server",
      allowAllOutbound: true,
    });

    webServerSG.addIngressRule(
      Peer.anyIpv4(),
      Port.tcp(80),
      "Allow HTTP access"
    );

    // Create IAM role for Systems Manager
    const role = new Role(this, "EC2Role", {
      assumedBy: new ServicePrincipal("ec2.amazonaws.com"),
    });

    role.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AmazonSSMManagedInstanceCore")
    );

    // Create user data script
    const userData = UserData.forLinux();
    userData.addCommands(
      "yum update -y",
      "yum install -y httpd",
      "systemctl start httpd",
      "systemctl enable httpd",
      'echo "<h1>Hello from EC2</h1>" > /var/www/html/index.html'
    );

    // Create EC2 instance
    const webServer = new Instance(this, "WebServer", {
      vpc,
      vpcSubnets: {
        subnetType: SubnetType.PUBLIC,
      },
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MICRO),
      machineImage: MachineImage.latestAmazonLinux2(),
      securityGroup: webServerSG,
      role: role,
      userData: userData,
      blockDevices: [
        {
          deviceName: "/dev/xvda",
          volume: BlockDeviceVolume.ebs(8, {
            volumeType: EbsDeviceVolumeType.GP3,
            deleteOnTermination: true,
          }),
        },
      ],
    });

    // Add CloudWatch agent configuration
    webServer.userData.addCommands(
      "yum install -y amazon-cloudwatch-agent",
      "systemctl start amazon-cloudwatch-agent",
      "systemctl enable amazon-cloudwatch-agent"
    );

    // Output the instance ID
    new CfnOutput(this, "InstanceId", {
      value: webServer.instanceId,
      description: "EC2 Instance ID",
    });

    // Output the public IP
    new CfnOutput(this, "PublicIP", {
      value: webServer.instancePublicIp,
      description: "EC2 Instance Public IP",
    });
  }
}
```

Deploy the stack:

```bash
cdk deploy --profile your-profile-name
```

### 2. Connect to Your Instance

Use AWS Systems Manager Session Manager to connect:

```bash
aws ssm start-session \
    --target your-instance-id \
    --profile your-profile-name
```

### 3. Verify Web Server Setup

1. **Check Apache Status**:

```bash
sudo systemctl status httpd
```

2. **Test Local Access**:

```bash
curl http://localhost
```

3. **Test Public Access**:
   - Open a web browser
   - Navigate to http://your-instance-public-ip

### 4. Monitor Your Instance

1. **View CloudWatch Metrics**:

   - Navigate to CloudWatch in AWS Console
   - Find metrics under "EC2" namespace
   - Check CPU utilization, network traffic, etc.

2. **Check System Logs**:

```bash
# View Apache access logs
sudo tail -f /var/log/httpd/access_log

# View system logs
sudo tail -f /var/log/messages
```

### 5. Create a Custom AMI

1. **Prepare the Instance**:

```bash
# Clean up history and logs
sudo yum clean all
sudo rm -rf /var/log/*
history -c
```

2. **Create AMI using AWS CLI**:

```bash
aws ec2 create-image \
    --instance-id your-instance-id \
    --name "WebServer-AMI" \
    --description "Apache web server AMI" \
    --profile your-profile-name
```

### 6. Test Instance Recovery

1. **Simulate a Failure**:

```bash
# Stop Apache service
sudo systemctl stop httpd
```

2. **Check System Status**:

```bash
# View service status
sudo systemctl status httpd

# Check system logs
sudo tail -f /var/log/messages
```

3. **Recover Service**:

```bash
# Start Apache service
sudo systemctl start httpd
```

## Validation Steps

After completing the lab, verify that:

1. ✅ Instance is running and accessible
2. ✅ Web server is functioning correctly
3. ✅ CloudWatch metrics are being collected
4. ✅ Systems Manager access is working
5. ✅ Security group rules are effective
6. ✅ Custom AMI was created successfully

## Troubleshooting

Common issues and solutions:

1. **Web Server Not Accessible**

   - Check security group rules
   - Verify Apache is running
   - Confirm instance is in public subnet
   - Check network ACLs

2. **Systems Manager Connection Issues**

   - Verify IAM role permissions
   - Check Systems Manager agent status
   - Ensure VPC endpoints are configured
   - Confirm instance has internet access

3. **CloudWatch Issues**
   - Check CloudWatch agent configuration
   - Verify IAM permissions
   - Review agent logs
   - Confirm metrics namespace

## Best Practices Demonstrated

This lab has implemented several EC2 best practices:

1. **Security**

   - Use of Systems Manager for access
   - Minimal security group rules
   - IAM roles for service access
   - Regular system updates

2. **Monitoring**

   - CloudWatch metrics enabled
   - System logs collection
   - Service status monitoring
   - Performance tracking

3. **Operations**
   - Automated instance configuration
   - Custom AMI creation
   - Proper volume configuration
   - Service recovery procedures

## Next Steps

After completing this lab, you can:

- Implement auto scaling
- Add load balancing
- Configure backup strategies
- Implement more complex monitoring
- Create multi-instance architectures

[DIAGRAM: EC2 Operations Flow]
Description: A sequence diagram showing how the EC2 operations will work in our lab. The diagram should:

1. Show the operation flow:
   - Instance creation
   - Configuration setup
   - Security group configuration
   - Network setup
2. Include the specific operations we perform in the lab
3. Show how different components interact
4. Illustrate the deployment patterns
   Use AWS's standard color scheme and include clear labels for each step.
