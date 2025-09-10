
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export async function presignUpload(key: string, contentType: string) {
  const client = new S3Client({
    region: process.env.S3_REGION || 'auto',
    endpoint: process.env.S3_ENDPOINT || undefined,
    forcePathStyle: true,
    credentials: (process.env.S3_ACCESS_KEY && process.env.S3_SECRET_KEY) ? {
      accessKeyId: process.env.S3_ACCESS_KEY!,
      secretAccessKey: process.env.S3_SECRET_KEY!
    } : undefined
  });
  const bucket = process.env.S3_BUCKET!;
  const cmd = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType, ACL: 'public-read' as any });
  const url = await getSignedUrl(client, cmd, { expiresIn: 60 * 5 });
  const publicUrl = `${(process.env.S3_ENDPOINT||'').replace(/\/$/,'')}/${bucket}/${key}`;
  return { url, publicUrl };
}
