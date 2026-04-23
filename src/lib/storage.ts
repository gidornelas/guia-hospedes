import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { env } from '@/lib/env'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'images', 'properties')

function getS3Client() {
  const endpoint = process.env.S3_ENDPOINT
  const region = process.env.S3_REGION || 'auto'

  return new S3Client({
    region,
    endpoint: endpoint || undefined,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
    },
    forcePathStyle: !!endpoint,
  })
}

function getPublicUrl(key: string) {
  const publicUrl = process.env.S3_PUBLIC_URL
  if (publicUrl) {
    return `${publicUrl.replace(/\/$/, '')}/${key}`
  }
  // Fallback para local
  return `/images/properties/${key}`
}

export async function uploadFile(
  buffer: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  const provider = env.storageProvider

  if (provider === 's3' || provider === 'r2') {
    const client = getS3Client()
    const bucket = process.env.S3_BUCKET_NAME
    if (!bucket) {
      throw new Error('S3_BUCKET_NAME nao configurado')
    }

    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      })
    )

    return getPublicUrl(key)
  }

  // Fallback: local filesystem
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true })
  }

  const filePath = path.join(UPLOAD_DIR, key)
  await writeFile(filePath, buffer)

  return `/images/properties/${key}`
}
