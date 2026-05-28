/**
 * s3.js
 * Low-level S3 operations: list, upload, download, delete.
 * All keys are automatically namespaced under the project prefix.
 */

import {
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { createWriteStream, createReadStream } from "fs";
import { pipeline } from "stream/promises";
import path from "path";

/**
 * List all S3 objects under a given prefix (project namespace).
 * Returns a Map of { relativeKey -> LastModified } for quick comparison.
 *
 * @param {S3Client} client
 * @param {string} bucket
 * @param {string} prefix  - e.g. "proj-abc123/"
 * @returns {Promise<Map<string, Date>>}
 */
export async function listS3Objects(client, bucket, prefix) {
  const objects = new Map();
  let continuationToken;

  do {
    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
      ContinuationToken: continuationToken,
    });

    const response = await client.send(command);

    for (const obj of response.Contents ?? []) {
      // Strip the project prefix to get the relative path
      const relKey = obj.Key.slice(prefix.length);
      if (relKey) objects.set(relKey, obj.LastModified);
    }

    continuationToken = response.IsTruncated
      ? response.NextContinuationToken
      : undefined;
  } while (continuationToken);

  return objects;
}

/**
 * Upload a local file to S3 under the project-prefixed key.
 *
 * @param {S3Client} client
 * @param {string} bucket
 * @param {string} s3Key   - full key including project prefix
 * @param {string} filePath - absolute local path
 */
export async function uploadFile(client, bucket, s3Key, filePath) {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: s3Key,
    Body: createReadStream(filePath),
  });

  await client.send(command);
}

/**
 * Download an S3 object to a local file path.
 * Creates parent directories if they don't exist.
 *
 * @param {S3Client} client
 * @param {string} bucket
 * @param {string} s3Key
 * @param {string} destPath - absolute local path to write to
 */
export async function downloadFile(client, bucket, s3Key, destPath) {
  const command = new GetObjectCommand({ Bucket: bucket, Key: s3Key });
  const response = await client.send(command);

  await pipeline(response.Body, createWriteStream(destPath));
}

/**
 * Delete an object from S3.
 *
 * @param {S3Client} client
 * @param {string} bucket
 * @param {string} s3Key
 */
export async function deleteS3Object(client, bucket, s3Key) {
  const command = new DeleteObjectCommand({ Bucket: bucket, Key: s3Key });
  await client.send(command);
}

/**
 * Check if a specific S3 key exists (HEAD request).
 * Returns true/false without downloading the object.
 *
 * @param {S3Client} client
 * @param {string} bucket
 * @param {string} s3Key
 * @returns {Promise<boolean>}
 */
export async function s3ObjectExists(client, bucket, s3Key) {
  try {
    await client.send(new HeadObjectCommand({ Bucket: bucket, Key: s3Key }));
    return true;
  } catch (err) {
    if (err.name === "NotFound" || err.$metadata?.httpStatusCode === 404)
      return false;
    throw err;
  }
}