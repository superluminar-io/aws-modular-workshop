// Backend service for providing temporary AWS credentials
// This should run on your server, not in the browser

const AWS = require('@aws-sdk/client-sts');
const express = require('express');
const cors = require('cors');

class CredentialsService {
  constructor() {
    this.sts = new AWS.STSClient({ region: 'us-east-1' });
    this.translateRoleArn = process.env.AWS_TRANSLATE_ROLE_ARN || 'arn:aws:iam::ACCOUNT:role/TranslateServiceRole';
    this.sessionDuration = 3600; // 1 hour
  }

  async assumeRoleForTranslation(sessionName = 'workshop-translation') {
    try {
      const command = new AWS.AssumeRoleCommand({
        RoleArn: this.translateRoleArn,
        RoleSessionName: sessionName,
        DurationSeconds: this.sessionDuration,
        Policy: JSON.stringify({
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Action: [
                'translate:TranslateText'
              ],
              Resource: '*'
            }
          ]
        })
      });

      const response = await this.sts.send(command);
      
      return {
        accessKeyId: response.Credentials.AccessKeyId,
        secretAccessKey: response.Credentials.SecretAccessKey,
        sessionToken: response.Credentials.SessionToken,
        expiration: response.Credentials.Expiration
      };
    } catch (error) {
      console.error('Error assuming role:', error);
      throw error;
    }
  }
}

// Express server setup
const app = express();
app.use(cors());
app.use(express.json());

const credentialsService = new CredentialsService();

// Endpoint to get temporary credentials
app.post('/api/credentials/translation', async (req, res) => {
  try {
    // In production, add authentication and authorization here
    // Validate user permissions, rate limiting, etc.
    
    const sessionName = `workshop-${Date.now()}`;
    const credentials = await credentialsService.assumeRoleForTranslation(sessionName);
    
    res.json({
      success: true,
      credentials,
      region: 'us-east-1'
    });
  } catch (error) {
    console.error('Failed to provide credentials:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to obtain temporary credentials'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

const PORT = process.env.PORT || 3001;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Credentials service running on port ${PORT}`);
  });
}

module.exports = { CredentialsService, app };