# AWS Workshop Diagram Creation Instructions

This document provides detailed instructions for manually creating the 10 high-impact complex architecture diagrams using draw.io. These diagrams represent sophisticated AWS patterns that warrant manual creation rather than automated Mermaid conversion.

## General Setup Instructions

### Before You Start

1. Open [draw.io](https://app.diagrams.net/) or use the desktop version
2. Create a new diagram using the **AWS Architecture 2023** template
3. Import the AWS Architecture symbol library if not already available
4. Set canvas size to **A4 Landscape (842 x 595)** for consistency
5. Use **AWS official color scheme**:
   - **Orange (#FF9900)** - AWS services
   - **Blue (#232F3E)** - Data flow arrows
   - **Green (#569A31)** - Success states
   - **Red (#DD344C)** - Error states
   - **Gray (#879196)** - Infrastructure elements

---

## 1. Step Functions Overview (lab_440_step_functions_overview.drawio.svg)

**Purpose:** Show multi-service orchestration architecture with Step Functions as the central coordinator.

### Layout Structure

- **Center:** Step Functions state machine icon (large)
- **Left side:** Input data sources and triggers
- **Right side:** AWS service integrations
- **Bottom:** Monitoring and logging
- **Top:** IAM roles and permissions

### Components to Include

1. **AWS Step Functions** icon (center, large)
2. **AWS Lambda** functions (3-4 icons arranged around Step Functions)
3. **AWS DynamoDB** table icon (right side)
4. **AWS SNS** topic icon (right side)
5. **AWS CloudWatch** logs/metrics icons (bottom)
6. **AWS IAM** role icons (top right)
7. **Data flow** representing input validation, parallel processing, choice states

### Specific Instructions

1. Place **Step Functions** icon at center (use largest size)
2. Add **state machine visualization** with labeled boxes: "Validate", "Parallel", "Choice", "Success", "Fail"
3. Connect Lambda functions to state machine with **bidirectional arrows**
4. Show **service integrations** with solid arrows to DynamoDB and SNS
5. Add **monitoring flows** with dotted lines to CloudWatch
6. Include **permission flows** with dashed lines from IAM to services
7. Label each component clearly with service names
8. Add **workflow annotations**: "Order Processing", "Payment", "Inventory", "Notifications"

---

## 2. Step Functions Implementation (lab_440_step_functions_implementation.drawio.svg)

**Purpose:** Detailed implementation view showing actual code flow and error handling patterns.

### Layout Structure

- **Left:** Input and validation
- **Center:** State machine with detailed states
- **Right:** Service integrations and outputs
- **Bottom:** Error handling and retry logic

### Components to Include

1. **Detailed state machine** with all states visible
2. **Lambda function details** (validation, payment, inventory)
3. **Error handling paths** with retry logic
4. **Service integration details** (DynamoDB operations, SNS publishing)
5. **CloudWatch integration** for monitoring each step

### Specific Instructions

1. Create **detailed state flow** showing: Start → Validate → Choice → Parallel → Success/Fail
2. Add **Lambda function boxes** with specific names: "ValidateOrder", "ProcessPayment", "UpdateInventory"
3. Show **error paths** with red arrows leading to failure states
4. Include **retry mechanisms** with circular arrows
5. Add **DynamoDB operations** with table schema indicators
6. Show **SNS message flow** with topic and subscription details
7. Include **execution monitoring** with CloudWatch dashboards
8. Add **timing annotations** for each state transition

---

## 3. EventBridge Overview (lab_420_eventbridge_overview.drawio.svg)

**Purpose:** Hub-and-spoke event-driven architecture showing EventBridge as central event router.

### Layout Structure

- **Center:** EventBridge custom bus
- **Left:** Event sources (applications, services)
- **Right:** Event targets and consumers
- **Top:** Event rules and filtering
- **Bottom:** Monitoring and archiving

### Components to Include

1. **AWS EventBridge** custom bus icon (center, large)
2. **Event sources:** Application events, S3 events, custom events
3. **Event targets:** Lambda, SNS, SQS, Step Functions
4. **Event rules** with pattern matching
5. **CloudWatch** monitoring and logs
6. **Event archive** for replay capability

### Specific Instructions

1. Place **EventBridge bus** at center with clear "Custom Event Bus" label
2. Add **event source icons** on left: Application, S3 bucket, Custom API
3. Show **event flow arrows** from sources to bus (different colors for different event types)
4. Add **rule processing** box showing event pattern matching
5. Include **target services** on right with specific icons
6. Show **event routing** with labeled arrows indicating rule matches
7. Add **monitoring flow** to CloudWatch with metrics
8. Include **archive component** showing event retention and replay

---

## 4. EventBridge Implementation (lab_420_eventbridge_implementation.drawio.svg)

**Purpose:** Practical implementation showing actual event patterns, rules, and complex routing logic.

### Layout Structure

- **Top:** Event pattern definitions and rule configuration
- **Center:** EventBridge processing engine
- **Bottom:** Target execution and dead letter handling
- **Right:** Monitoring and troubleshooting

### Components to Include

1. **Detailed event patterns** with JSON structure hints
2. **Rule engine** with multiple filtering conditions
3. **Target configuration** with specific settings
4. **Dead letter queues** for failed events
5. **Monitoring integration** with alarms and notifications

### Specific Instructions

1. Create **event pattern boxes** showing sample JSON structures
2. Add **rule processing flow** with decision diamonds for different patterns
3. Show **target configuration** with retry policies and DLQ setup
4. Include **error handling** paths with red arrows
5. Add **monitoring dashboard** showing key metrics
6. Show **alerting integration** with SNS notifications
7. Include **troubleshooting flow** with CloudWatch Insights
8. Add **performance optimization** indicators

---

## 5. API Gateway Overview (lab_380_api_gateway_overview.drawio.svg)

**Purpose:** Complex REST API architecture showing security, integration, and monitoring layers.

### Layout Structure

- **Left:** Client requests and authentication
- **Center:** API Gateway with multiple resources/methods
- **Right:** Backend integrations and services
- **Bottom:** Monitoring and analytics

### Components to Include

1. **AWS API Gateway** icon (center, prominent)
2. **Client applications** (web, mobile, third-party)
3. **Authentication layers** (API keys, IAM, Cognito)
4. **Lambda integrations** for business logic
5. **DynamoDB** backend storage
6. **CloudWatch** monitoring and X-Ray tracing

### Specific Instructions

1. Place **API Gateway** at center with clear REST API structure
2. Add **client types** on left: Web app, Mobile app, External API
3. Show **authentication flow** with API key validation
4. Include **resource hierarchy**: `/items` with GET/POST methods
5. Add **integration types** with Lambda proxy integration
6. Show **data flow** through API → Lambda → DynamoDB
7. Include **response transformation** and error handling
8. Add **monitoring components**: CloudWatch logs, metrics, X-Ray traces

---

## 6. API Gateway Implementation (lab_380_api_gateway_implementation.drawio.svg)

**Purpose:** Detailed request/response flow showing actual implementation patterns and security.

### Layout Structure

- **Top:** Request validation and throttling
- **Center:** Processing pipeline with transformations
- **Bottom:** Response handling and caching
- **Right:** Security and monitoring integration

### Components to Include

1. **Request validation** with schema checking
2. **Rate limiting** and throttling mechanisms
3. **Integration transformations** and mapping templates
4. **Error handling** with custom error responses
5. **Caching** configuration and invalidation
6. **Security integration** with detailed IAM flows

### Specific Instructions

1. Create **request flow** showing validation → throttling → integration
2. Add **method configuration** with detailed settings
3. Show **integration mapping** with request/response transformation
4. Include **error response** handling with HTTP status codes
5. Add **caching layer** with cache key configuration
6. Show **security enforcement** with IAM policy evaluation
7. Include **monitoring points** at each stage
8. Add **performance metrics** and optimization indicators

---

## 7. VPC Overview (lab_160_vpc_overview.drawio.svg)

**Purpose:** Multi-AZ network architecture showing complete VPC setup with all networking components.

### Layout Structure

- **Background:** VPC boundary with CIDR notation
- **Top half:** Public subnets across AZs
- **Bottom half:** Private subnets across AZs
- **Left:** Internet connectivity components
- **Right:** Internal networking and endpoints

### Components to Include

1. **VPC boundary** with CIDR range (10.0.0.0/16)
2. **Multiple Availability Zones** (2 AZs minimum)
3. **Public/private subnets** in each AZ
4. **Internet Gateway** and **NAT Gateway**
5. **Route tables** and routing configuration
6. **Security groups** and **NACLs**
7. **VPC endpoints** for AWS services

### Specific Instructions

1. Draw **VPC container** with labeled CIDR range
2. Create **AZ sections** showing geographic distribution
3. Add **subnet icons** with specific CIDR ranges (10.0.1.0/24, etc.)
4. Show **Internet Gateway** connection to public subnets
5. Include **NAT Gateway** for private subnet internet access
6. Add **route table icons** with routing rules
7. Show **security group** relationships between subnets
8. Include **VPC endpoints** for S3 and other AWS services

---

## 8. VPC Implementation (lab_160_vpc_implementation.drawio.svg)

**Purpose:** Detailed networking implementation showing actual routing, security rules, and traffic flow.

### Layout Structure

- **Detailed routing tables** with specific routes
- **Security group rules** with port/protocol details
- **Network ACL configurations**
- **Traffic flow patterns** for different scenarios

### Components to Include

1. **Detailed route tables** with destination/target mappings
2. **Security group rules** showing inbound/outbound ports
3. **Network ACL rules** with allow/deny configurations
4. **Instance placement** in specific subnets
5. **Traffic flow examples** for different use cases
6. **VPC Flow Logs** configuration

### Specific Instructions

1. Create **routing table details** showing 0.0.0.0/0 → IGW, 10.0.0.0/16 → Local
2. Add **security group rules** with specific ports (80, 443, 22)
3. Show **NACL rules** with rule numbers and priorities
4. Include **instance placement** strategy across AZs
5. Add **traffic flow arrows** showing allowed/blocked traffic
6. Show **monitoring setup** with VPC Flow Logs
7. Include **troubleshooting indicators** for common issues
8. Add **best practice annotations** for security and reliability

---

## 9. ECS Overview (lab_260_ecs_overview.drawio.svg)

**Purpose:** Container orchestration architecture showing Fargate, load balancing, and scaling.

### Layout Structure

- **Top:** Load balancing and external access
- **Center:** ECS cluster with Fargate services
- **Bottom:** Supporting infrastructure (VPC, monitoring)
- **Right:** Auto-scaling and service discovery

### Components to Include

1. **Application Load Balancer** with target groups
2. **ECS Cluster** with Fargate services
3. **Task definitions** and container configurations
4. **Auto Scaling** policies and CloudWatch metrics
5. **Service discovery** with Route 53 integration
6. **VPC networking** optimized for containers

### Specific Instructions

1. Place **ALB** at top with listener configurations
2. Add **ECS cluster** showing multiple services
3. Include **Fargate tasks** with container details
4. Show **target group** health checks and registration
5. Add **auto-scaling** triggers based on CPU/memory
6. Include **service discovery** with DNS resolution
7. Show **VPC integration** with private subnets
8. Add **monitoring** with Container Insights

---

## 10. ECS Implementation (lab_260_ecs_implementation.drawio.svg)

**Purpose:** Production deployment setup showing detailed container orchestration and operational patterns.

### Layout Structure

- **Detailed task definitions** with resource allocations
- **Service configuration** with deployment strategies
- **Load balancer integration** with health checking
- **Monitoring and logging** with comprehensive observability

### Components to Include

1. **Task definition details** with CPU/memory allocations
2. **Service deployment** strategies (rolling update, blue/green)
3. **Health check configuration** at multiple layers
4. **Log aggregation** and monitoring setup
5. **Security configuration** with task roles and network policies
6. **Performance optimization** patterns

### Specific Instructions

1. Create **task definition** showing container specifications
2. Add **service configuration** with desired count and placement
3. Show **deployment process** with rolling update strategy
4. Include **health check** flow: ALB → Target Group → Tasks
5. Add **logging flow** to CloudWatch with log groups
6. Show **security** integration with IAM task roles
7. Include **monitoring dashboard** with key metrics
8. Add **troubleshooting** guides for common issues

---

## Drawing Tips and Best Practices

### Visual Consistency

- Use **AWS official icons** consistently throughout all diagrams
- Maintain **consistent spacing** (20px minimum between elements)
- Apply **consistent line weights** (2px for primary flows, 1px for secondary)
- Use **consistent colors** as defined in the color scheme

### Clarity and Readability

- **Label everything** clearly with service names and purposes
- Use **different arrow styles** for different types of connections
- Add **annotations** for complex concepts or configurations
- Include **legend** when using multiple symbol types

### Technical Accuracy

- Verify **service relationships** match the actual lab implementations
- Show **realistic data flows** based on the hands-on exercises
- Include **error handling** paths where applicable
- Represent **security boundaries** accurately

### Layout Guidelines

- **Group related components** visually
- Use **consistent alignment** for professional appearance
- Leave **adequate white space** for readability
- Consider **information hierarchy** (most important elements prominent)

---

## File Export Settings

When exporting each diagram:

1. **Format:** SVG for web compatibility
2. **Include:** Embedded fonts for consistency
3. **Quality:** High resolution for clarity
4. **Background:** Transparent for flexibility
5. **Naming:** Use exact filenames as specified for each diagram

These diagrams will serve as the primary visual aids for understanding complex AWS architectures in the workshop, providing learners with clear, accurate representations of production-ready implementations.
