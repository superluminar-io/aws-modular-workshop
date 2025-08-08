#!/bin/bash

# AWS Translation Service Deployment Script

set -e

echo "🚀 Deploying AWS Translation Service..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if jq is installed for JSON processing
if ! command -v jq &> /dev/null; then
    echo "❌ jq is not installed. Please install it for JSON processing."
    exit 1
fi

# Get AWS account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "📋 Using AWS Account: $ACCOUNT_ID"

# Update trust policy with actual account ID
sed "s/ACCOUNT_ID/$ACCOUNT_ID/g" aws/translate-trust-policy.json > aws/translate-trust-policy-updated.json

# Create IAM role
echo "🔐 Creating IAM role..."
aws iam create-role \
    --role-name TranslateServiceRole \
    --assume-role-policy-document file://aws/translate-trust-policy-updated.json \
    --description "Role for AWS Translate access in workshop" \
    || echo "Role may already exist, continuing..."

# Attach policy to role
echo "📝 Attaching translation policy..."
aws iam put-role-policy \
    --role-name TranslateServiceRole \
    --policy-name TranslateAccess \
    --policy-document file://aws/translate-role-policy.json

# Get role ARN
ROLE_ARN=$(aws iam get-role --role-name TranslateServiceRole --query 'Role.Arn' --output text)
echo "✅ Role ARN: $ROLE_ARN"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Create environment file
echo "⚙️  Creating environment configuration..."
cat > .env << EOF
AWS_TRANSLATE_ROLE_ARN=$ROLE_ARN
AWS_REGION=us-east-1
PORT=3001
EOF

echo "✅ Backend configured with role: $ROLE_ARN"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ..
npm install

echo "🎉 Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Start backend service: cd backend && npm start"
echo "2. Start frontend service: npm start"
echo "3. Visit http://localhost:3000 and test the translation toggle"
echo ""
echo "The system will:"
echo "- Use mock translations in development"
echo "- Fall back to real AWS Translate when credentials are available"
echo "- Automatically refresh credentials before expiration"

# Cleanup temporary files
rm -f aws/translate-trust-policy-updated.json