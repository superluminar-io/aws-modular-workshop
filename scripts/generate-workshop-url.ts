import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

async function generatePresignedUrl() {
  const client = new S3Client({});
  const command = new GetObjectCommand({
    Bucket: "your-workshop-bucket",
    Key: "lab-01-s3-cdk.zip",
  });

  const url = await getSignedUrl(client, command, { expiresIn: 86400 });
  console.log(`Download link (valid for 24 hours): ${url}`);
}

generatePresignedUrl().catch(console.error);
