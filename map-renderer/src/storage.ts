// Where rendered images and their metadata go: S3, or a local folder for
// dry runs.
import fs from 'fs';
import path from 'path';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

import { S3_BUCKET, S3_REGION } from './config';

export interface Storage {
  readJson<T>(key: string): Promise<T | null>;
  writeJson(key: string, value: unknown): Promise<void>;
  writeImage(key: string, png: Buffer): Promise<void>;
  describe(): string;
}

export class S3Storage implements Storage {
  private client = new S3Client({ region: S3_REGION });

  async readJson<T>(key: string): Promise<T | null> {
    try {
      const res = await this.client.send(new GetObjectCommand({ Bucket: S3_BUCKET, Key: key }));
      return JSON.parse(await res.Body!.transformToString()) as T;
    } catch (error: any) {
      if (error?.name === 'NoSuchKey' || error?.$metadata?.httpStatusCode === 404) return null;
      throw error;
    }
  }

  private put(key: string, body: Buffer | string, contentType: string, cacheSeconds: number) {
    return this.client.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        Body: body,
        ContentType: contentType,
        // same ACL the backend uses for public images in this bucket
        ACL: 'public-read',
        // URLs are stable (they're what Google indexes), so keep caching short
        CacheControl: `public, max-age=${cacheSeconds}`,
      }),
    );
  }

  async writeJson(key: string, value: unknown) {
    await this.put(key, JSON.stringify(value), 'application/json', 300);
  }

  async writeImage(key: string, png: Buffer) {
    await this.put(key, png, 'image/png', 86400);
  }

  describe() {
    return `s3://${S3_BUCKET}`;
  }
}

export class LocalStorage implements Storage {
  constructor(private dir: string) {}

  private file(key: string) {
    const file = path.join(this.dir, key);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    return file;
  }

  async readJson<T>(key: string): Promise<T | null> {
    const file = path.join(this.dir, key);
    return fs.existsSync(file) ? (JSON.parse(fs.readFileSync(file, 'utf8')) as T) : null;
  }

  async writeJson(key: string, value: unknown) {
    fs.writeFileSync(this.file(key), JSON.stringify(value, null, 1));
  }

  async writeImage(key: string, png: Buffer) {
    fs.writeFileSync(this.file(key), png);
  }

  describe() {
    return this.dir;
  }
}
