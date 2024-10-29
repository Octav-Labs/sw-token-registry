import { Redis, RedisOptions } from 'ioredis';
import {
  HeadBucketCommand,
  S3Client,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import { Logger } from './Logger';

export type TokenRegistryConfig = {
  logger?: Logger;
  redisOptions: RedisOptions;
  s3Config: S3ClientConfig & { bucket: string };
};

export class TokenRegistry {
  private logger: Logger | undefined;
  private redisClient: Redis;
  private s3Client: S3Client;
  private s3Bucket: string;

  constructor(config: TokenRegistryConfig) {
    this.logger = config.logger;

    // Redis
    this.redisClient = new Redis(config.redisOptions);
    this.redisClient.on('connect', () => {
      this.logger?.info('TokenRegistry connected to Redis');
    });
    this.redisClient.on('error', (err) => {
      this.logger?.error('TokenRegistry Redis client error', err);
    });

    // S3
    this.s3Client = new S3Client(config.s3Config);
    this.s3Bucket = config.s3Config.bucket;
    this.checkS3Client();
  }

  async checkS3Client(): Promise<void> {
    await this.s3Client.send(new HeadBucketCommand({ Bucket: this.s3Bucket }));
  }

  async disconnect(): Promise<void> {
    try {
      await this.redisClient.quit();
      this.logger?.info('TokenRegistry disconnected from Redis');
    } catch (error) {
      this.logger?.error('TokenRegistry error disconnecting from Redis', error);
    }
  }
}
