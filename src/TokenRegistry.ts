import { Redis, RedisOptions } from 'ioredis';
import {
  HeadBucketCommand,
  S3Client,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import { NetworkIdType } from '@sonarwatch/portfolio-core';
import { Logger } from './Logger';
import Fetcher from './Fetcher';
import { Job } from './Job';
import { Token } from './types';
import { TtlMap } from './TtlMap';

export type TokenRegistryConfig = {
  logger?: Logger;
  redisOptions: RedisOptions;
  s3Config: S3ClientConfig & { bucket: string };
  fetchers: Partial<Record<NetworkIdType, Fetcher>>;
  jobs: Job[];
  redisTtlMs?: number;
  memoryTtlMs?: number;
};

export class TokenRegistry {
  private logger: Logger | undefined;
  private redisClient: Redis;
  private s3Client: S3Client;
  private s3Bucket: string;
  private fetchers: Partial<Record<NetworkIdType, Fetcher>>;
  private jobs: Job[];
  private redisTtl: number;
  private memoryTtl: number;
  private ttlMap: TtlMap<string, Token | null>;

  constructor(config: TokenRegistryConfig) {
    this.logger = config.logger;
    this.fetchers = config.fetchers;
    this.jobs = config.jobs;
    this.redisTtl = config.redisTtlMs
      ? Math.round(config.redisTtlMs / 1000)
      : 86400;
    this.memoryTtl = config.memoryTtlMs
      ? Math.round(config.memoryTtlMs / 1000)
      : 3600;
    this.ttlMap = new TtlMap(this.memoryTtl);

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

  async getToken(
    networkId: NetworkIdType,
    address: string
  ): Promise<Token | null> {
    const key = `token:${networkId}:${address}`;

    // Check ttlMap
    const memoryToken = await this.ttlMap.get(key);
    if (memoryToken !== undefined) return memoryToken;

    // Check Redis cache first
    const redisToken = await this.redisClient.get(key);
    if (redisToken) return JSON.parse(redisToken) as Token | null;

    if (!this.fetchers[networkId])
      throw new Error(`Fetcher network is not configured: ${networkId}`);

    // Fetch if not in cache
    const token = await this.fetchers[networkId].fetch(address);
    this.ttlMap.set(key, token);
    await this.redisClient.set(key, JSON.stringify(token), 'EX', this.redisTtl);
    return token;
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
