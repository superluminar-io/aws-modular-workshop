# Glossary of AWS Terms

This glossary provides definitions for key AWS terms and concepts used throughout this professional training workshop. The definitions focus on practical implementation details and architectural considerations relevant to production environments.

## A

- **Amazon API Gateway**: A fully managed service for creating, publishing, maintaining, monitoring, and securing APIs at scale. Supports REST and WebSocket APIs with features like throttling, caching, and request/response transformations.

- **Amazon Aurora**: Amazon's cloud-native relational database engine compatible with MySQL and PostgreSQL, offering up to 5x better performance than standard MySQL and 3x better than standard PostgreSQL.

- **Amazon Aurora Serverless**: An on-demand, auto-scaling configuration for Amazon Aurora that automatically adjusts capacity based on application demand, eliminating the need for database capacity planning.

- **Amazon CloudFront**: A global content delivery network (CDN) service providing low-latency content delivery through a worldwide network of edge locations, with advanced caching and security features.

- **Amazon CloudWatch**: A comprehensive monitoring and observability service providing metrics, logs, and alarms for AWS resources and applications, essential for maintaining production system reliability.

- **Amazon DynamoDB**: A fully managed NoSQL database service designed for applications requiring single-digit millisecond latency at any scale, with built-in security, backup, and multi-region replication.

- **Amazon EC2 (Elastic Compute Cloud)**: Virtual servers in the cloud providing scalable compute capacity with multiple instance types optimized for different workloads and performance requirements.

- **Amazon ECR (Elastic Container Registry)**: A fully managed Docker container registry integrated with ECS and EKS, providing secure, scalable, and reliable container image management.

- **Amazon ECS (Elastic Container Service)**: A container orchestration service for running and managing Docker containers at scale, with integration to AWS networking and security services.

- **Amazon EventBridge**: A serverless event bus enabling event-driven architectures by routing events between AWS services, SaaS applications, and custom applications with powerful filtering and transformation capabilities.

- **Amazon Machine Image (AMI)**: A pre-configured virtual machine template containing the OS, application server, and applications needed to launch EC2 instances, supporting infrastructure standardization and rapid deployment.

- **Amazon RDS (Relational Database Service)**: A managed relational database service supporting multiple database engines (MySQL, PostgreSQL, MariaDB, Oracle, SQL Server) with automated backups, patching, and scaling.

- **Amazon S3 (Simple Storage Service)**: Object storage service offering virtually unlimited scalability with 99.999999999% (11 9's) durability, supporting multiple storage classes for cost optimization.

- **Amazon SNS (Simple Notification Service)**: A fully managed pub/sub messaging service supporting multiple protocols (HTTP/HTTPS, email, SMS, SQS) for decoupling microservices and sending notifications.

- **Amazon SQS (Simple Queue Service)**: A fully managed message queuing service providing reliable, scalable, and secure message delivery between distributed system components.

- **Amazon VPC (Virtual Private Cloud)**: A logically isolated network environment within AWS where you can launch resources with complete control over networking configuration, security, and connectivity.

- **Auto Scaling**: Automated capacity management that adjusts compute resources based on demand, ensuring application availability while optimizing costs.

- **Availability Zone (AZ)**: Physically separated data center facilities within an AWS Region, designed for fault isolation and high availability deployments.

## B

- **AWS Backup**: A centralized backup service providing policy-based backup across AWS services with compliance reporting and cross-region/cross-account backup capabilities.

- **Blue/Green Deployment**: A deployment strategy using two identical production environments to minimize downtime and reduce deployment risk through instant traffic switching.

## C

- **CI/CD (Continuous Integration/Continuous Deployment)**: Automated software delivery practices enabling frequent, reliable deployments through automated testing, building, and deployment pipelines.

- **AWS CloudFormation**: Infrastructure as Code service using declarative templates (JSON/YAML) to provision and manage AWS resources consistently and repeatably.

- **AWS CloudTrail**: API logging service providing comprehensive audit trails for governance, compliance, and security analysis of AWS account activity.

- **AWS CodeBuild**: Fully managed build service that compiles source code, runs tests, and produces deployment artifacts, scaling automatically to handle multiple builds concurrently.

- **AWS CodePipeline**: Managed continuous delivery service that automates release pipelines with integration to various source control, build, test, and deployment tools.

- **Container**: Lightweight, portable, and consistent runtime environment that packages applications with their dependencies, enabling consistent deployment across environments.

- **Construct**: The fundamental building block of AWS CDK applications, representing cloud components with sensible defaults and best practices built-in.

## D

- **Dead Letter Queue (DLQ)**: A messaging pattern for handling failed message processing, essential for building resilient distributed systems and debugging message failures.

- **Docker**: Containerization platform enabling consistent application packaging and deployment across different environments through container images and runtime isolation.

- **Dockerfile**: Declarative script containing instructions for building Docker images, defining the application environment and dependencies in a reproducible manner.

## E

- **Edge Locations**: CloudFront's global network of caching servers strategically placed to deliver content with minimal latency to end users worldwide.

- **Elastic IP**: Static IPv4 addresses for dynamic cloud computing, enabling consistent external connectivity even when underlying instances change.

- **Elastic Load Balancing**: Managed load balancing service distributing incoming traffic across multiple targets with health checking, SSL termination, and advanced routing capabilities.

- **Event-Driven Architecture**: Architectural pattern where system components communicate through events, enabling loose coupling, scalability, and real-time processing capabilities.

## F

- **AWS Fargate**: Serverless compute engine for containers that eliminates the need to manage underlying infrastructure while providing isolation and security for containerized applications.

- **Fan-out Pattern**: Messaging architecture where a single event triggers multiple parallel processing paths, commonly used in microservices and event-driven systems.

## G

- **Global Secondary Index (GSI)**: DynamoDB index with different partition and sort keys from the base table, enabling efficient querying on alternative access patterns.

## I

- **AWS IAM (Identity and Access Management)**: Fine-grained access control service using policies, roles, and permissions to secure AWS resources following the principle of least privilege.

- **Infrastructure as Code (IaC)**: Practice of managing infrastructure through code rather than manual processes, enabling version control, reproducibility, and automated deployments.

- **Internet Gateway**: Horizontally scaled, redundant VPC component enabling bidirectional internet connectivity for resources in public subnets.

## K

- **AWS KMS (Key Management Service)**: Managed encryption key service providing centralized key management with auditing, rotation, and integration across AWS services for data protection.

## L

- **AWS Lambda**: Serverless compute service executing code in response to events without managing servers, supporting multiple runtimes and automatic scaling.

- **Local Secondary Index (LSI)**: DynamoDB index sharing the table's partition key but with a different sort key, providing alternative query patterns on the same partition.

## M

- **Microservices**: Architectural approach structuring applications as loosely coupled, independently deployable services, each responsible for specific business capabilities.

- **Multi-AZ Deployment**: High availability configuration replicating resources across multiple Availability Zones to provide fault tolerance and minimize downtime.

## N

- **NAT Gateway**: Managed Network Address Translation service enabling outbound internet connectivity for resources in private subnets while preventing inbound internet access.

- **NoSQL**: Non-relational database model optimized for specific data patterns, offering flexible schemas and horizontal scaling capabilities for modern applications.

## O

- **Observability**: System design principle enabling understanding of internal system state through metrics, logs, and traces, crucial for maintaining production systems.

## P

- **Parameter Groups**: Database engine configuration templates in RDS allowing consistent database settings across multiple instances.

- **Parameter Store**: Hierarchical configuration and secrets management service within AWS Systems Manager, supporting encrypted values and fine-grained access control.

## R

- **Read Replicas**: Database copies optimized for read operations, enabling read scaling and geographic distribution of database workloads.

- **Region**: Geographic area containing multiple isolated Availability Zones, providing data residency and latency optimization options.

- **Route Table**: Network routing rules determining traffic flow within VPCs and to external networks, essential for network segmentation and security.

## S

- **AWS Secrets Manager**: Managed service for storing, retrieving, and rotating database credentials and other secrets with automatic rotation and fine-grained access control.

- **Security Group**: Virtual firewall controlling inbound and outbound traffic at the instance level, operating as a whitelist with stateful connection tracking.

- **Serverless**: Cloud computing model where infrastructure management is abstracted away, enabling focus on business logic while achieving automatic scaling and pay-per-use pricing.

- **Session Manager**: Browser-based shell access to EC2 instances through AWS Systems Manager, eliminating the need for SSH keys and providing audit trails.

- **Spot Instances**: Cost-effective EC2 capacity using unused infrastructure at up to 90% discount, suitable for fault-tolerant and flexible workloads.

- **AWS Step Functions**: Visual workflow service for orchestrating distributed applications and microservices using state machines with error handling, parallel processing, and service integrations.

- **Subnet**: IP address range within a VPC, used for network segmentation and isolation with public/private connectivity options.

- **AWS Systems Manager**: Unified interface for operational data and task automation across AWS resources, providing patch management, configuration compliance, and operational insights.

## T

- **Task Definition**: ECS blueprint specifying container configuration, resource requirements, and networking settings for containerized applications.

- **Tracing**: Distributed system monitoring technique tracking request flows across service boundaries, essential for debugging and performance optimization in microservices architectures.

## V

- **VPC Endpoint**: Private connectivity service enabling secure communication with AWS services without internet gateway traversal, reducing bandwidth costs and improving security.

- **VPC Peering**: Network connection between VPCs enabling direct routing using private IP addresses, supporting multi-VPC architectures and cross-account connectivity.

## W

- **Workflow**: Automated sequence of tasks coordinated to achieve business objectives, often implemented using Step Functions or other orchestration services.

## X

- **AWS X-Ray**: Distributed tracing service providing performance insights and dependency mapping for microservices and serverless applications, essential for production troubleshooting.

---

## AWS Service Acronyms and Technical Abbreviations

- **ACL**: Access Control List
- **ALB**: Application Load Balancer
- **API**: Application Programming Interface
- **ARN**: Amazon Resource Name
- **CDK**: Cloud Development Kit
- **CDN**: Content Delivery Network
- **CIDR**: Classless Inter-Domain Routing
- **CLI**: Command Line Interface
- **DLQ**: Dead Letter Queue
- **DNS**: Domain Name System
- **EBS**: Elastic Block Store
- **GSI**: Global Secondary Index
- **HTTP/HTTPS**: Hypertext Transfer Protocol/Secure
- **IAM**: Identity and Access Management
- **JSON**: JavaScript Object Notation
- **LSI**: Local Secondary Index
- **NACL**: Network Access Control List
- **REST**: Representational State Transfer
- **SDK**: Software Development Kit
- **SLA**: Service Level Agreement
- **SSL/TLS**: Secure Sockets Layer/Transport Layer Security
- **VPC**: Virtual Private Cloud
- **YAML**: YAML Ain't Markup Language
