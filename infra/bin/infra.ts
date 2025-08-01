#!/usr/bin/env node
import { App } from 'aws-cdk-lib'
import { InfraStack } from '../lib/infra-stack'

const app = new App()
new InfraStack(app, 'AwsWorkshopStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'eu-central-1',
  },
  description: 'AWS Lego Workshop - Static Website Deployment',
  tags: {
    Project: 'AWS-Workshop',
    Environment: 'Production',
    ManagedBy: 'CDK',
  },
})
