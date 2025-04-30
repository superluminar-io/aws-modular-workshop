#!/bin/bash

# Create the labs directory if it doesn't exist
mkdir -p labs

# Array of lab folders
labs=(
    "lab_100_cdk_foundations"
    "lab_120_iam_permissions"
    "lab_140_s3_basics"
    "lab_160_vpc_networking"
    "lab_180_ec2_deployment"
    "lab_200_systems_manager"
    "lab_220_rds_basics"
    "lab_240_ecr_docker_basics"
    "lab_260_ecs_on_fargate"
    "lab_280_dynamodb_basics"
    "lab_300_aurora_serverless"
    "lab_320_cicd_infrastructure"
    "lab_340_cicd_containers"
    "lab_360_lambda_event_triggers"
    "lab_380_api_gateway_integration"
    "lab_400_sns_sqs"
    "lab_420_eventbridge"
    "lab_440_step_functions"
    "lab_460_secrets_manager"
    "lab_480_resource_policies"
    "lab_500_aws_backup"
    "lab_520_cloudwatch_logs"
    "lab_540_xray_tracing"
    "lab_560_cloudtrail_audit"
)

# Create each lab folder
for lab in "${labs[@]}"; do
    mkdir -p "labs/$lab"
    echo "Created $lab"
done

echo "All lab folders have been created successfully!" 