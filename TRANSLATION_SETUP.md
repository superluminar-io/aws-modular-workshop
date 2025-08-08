# AWS Translation Setup Guide

This workshop now includes Amazon Translate functionality to automatically translate content into German. Here's how to set it up and use it.

## Features

- 🌍 One-click language toggle (EN ↔ DE)
- 🚀 Real-time translation of all content
- 💾 Translation caching for improved performance
- 📱 Responsive design with mobile support
- 🎯 Seamless integration with Docsify

## Quick Start (Mock Translation)

The translation feature works out of the box with mock translations for demonstration purposes. Simply:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Click the language toggle button (🇺🇸 EN / 🇩🇪 DE) in the top-right corner

## Production Setup with AWS Translate

To use real AWS Translate service, you'll need to configure AWS credentials:

### 1. AWS Account Setup

1. Create an AWS account if you don't have one
2. Ensure your account has access to Amazon Translate service
3. Note your preferred AWS region (default: us-east-1)

### 2. AWS IAM Role Setup (Recommended)

#### Create IAM Role for Translation Service

1. **Create the IAM Role:**
   ```bash
   aws iam create-role \
     --role-name TranslateServiceRole \
     --assume-role-policy-document file://aws/translate-trust-policy.json
   ```

2. **Attach Translation Policy:**
   ```bash
   aws iam put-role-policy \
     --role-name TranslateServiceRole \
     --policy-name TranslateAccess \
     --policy-document file://aws/translate-role-policy.json
   ```

3. **Note the Role ARN:**
   ```bash
   aws iam get-role --role-name TranslateServiceRole --query 'Role.Arn'
   ```

#### Backend Service Setup

1. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   export AWS_TRANSLATE_ROLE_ARN="arn:aws:iam::YOUR_ACCOUNT:role/TranslateServiceRole"
   export AWS_REGION="us-east-1"
   ```

3. **Start the credentials service:**
   ```bash
   npm start
   ```

#### Alternative: Direct IAM Role (for EC2/ECS/Lambda)

If running on AWS infrastructure, attach the TranslateServiceRole directly to your:
- EC2 instances
- ECS task definitions  
- Lambda functions
- EKS service accounts

### 3. Enable Real AWS Translate

1. Include AWS SDK in your HTML:
   ```html
   <script src="https://sdk.amazonaws.com/js/aws-sdk-2.1.24.min.js"></script>
   ```

2. Update the `translator.js` file to use real AWS Translate instead of mock:
   ```javascript
   // Replace mockTranslate with actual AWS Translate calls
   async translateText(text, sourceLanguage = 'en', targetLanguage = 'de') {
     // Use AWS Translate SDK here
     const translate = new AWS.Translate();
     const params = {
       Text: text,
       SourceLanguageCode: sourceLanguage,
       TargetLanguageCode: targetLanguage
     };
     
     const result = await translate.translateText(params).promise();
     return result.TranslatedText;
   }
   ```

### 4. IAM Policy

Ensure your credentials have this minimal IAM policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "translate:TranslateText"
            ],
            "Resource": "*"
        }
    ]
}
```

## Usage

### Language Toggle

- Click the language toggle button in the top-right corner
- Button shows current language (🇺🇸 EN or 🇩🇪 DE)
- Loading animation appears during translation
- All visible content gets translated automatically

### Supported Content

The translation service automatically handles:

- Headings (h1-h6)
- Paragraphs and text content
- List items
- Table content
- Sidebar navigation
- Button text
- Pagination elements

### Caching

- Translations are cached in memory for improved performance
- Cache persists during the session
- Reduces API calls and improves response time

## Customization

### Adding More Languages

1. Modify the `TranslationService` class in `translator.js`
2. Add new language codes and update the toggle logic
3. Extend the toggle button to support multiple languages

### Styling

Customize the language toggle appearance by editing `css/language-toggle.css`:

- Colors and gradients
- Button size and positioning
- Hover effects and animations
- Responsive behavior

### Performance Tuning

- Adjust batch size for translation processing
- Modify cache size limits
- Configure debounce timing for dynamic content

## Troubleshooting

### Common Issues

1. **Toggle button not appearing**: Check CSS file loading
2. **Translations not working**: Verify JavaScript console for errors
3. **AWS errors**: Check credentials and IAM permissions
4. **Slow performance**: Ensure caching is working properly

### Development Mode

For development and testing, the system uses mock translations that:
- Work without AWS credentials
- Provide immediate responses
- Show translation placeholders
- Help verify the UI functionality

## File Structure

```
docs/
├── css/
│   └── language-toggle.css    # Toggle button styles
├── js/
│   ├── translator.js          # Main translation service
│   └── aws-config.js         # AWS configuration helper
├── index.html                # Updated with translation integration
└── ...                       # Other workshop files
```

## Contributing

To contribute to the translation feature:

1. Test with mock translations first
2. Ensure responsive design works
3. Add new language support carefully
4. Update documentation as needed

## Security Notes

- Never commit AWS credentials to version control
- Use minimal IAM permissions
- Consider implementing rate limiting
- Monitor AWS usage and costs
- Use HTTPS in production environments