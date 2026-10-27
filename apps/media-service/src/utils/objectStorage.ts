import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import crypto from "node:crypto";

async function getClientInfo() {
  const endpoint = process.env.AWS_ENDPOINT_URL_S3;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const region = process.env.AWS_REGION;

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    throw new Error("envs are missing for object storage");
  }

  return new S3Client({
    region,
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true,
  });
}

export async function uploadFileBuffer(
  buffer: Buffer,
  contentType = "image/jpeg",
): Promise<{ imageUrl: string; publicId: string }> {
  const bucket = process.env.STORAGE_BUCKET;
  const endpoint = process.env.AWS_ENDPOINT_URL_S3;

  if (!bucket || !endpoint) {
    throw new Error("Bucket and Endpoint are not present");
  }

  const key = `task-attachment/${crypto.randomUUID()}`;

  (await getClientInfo()).send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }),
  );

  const baseUrl = endpoint.endsWith("/") ? endpoint.slice(0, 1) : endpoint;

  return {
    publicId: key,
    imageUrl: `${baseUrl}/${bucket}/${key}`,
  };
}
