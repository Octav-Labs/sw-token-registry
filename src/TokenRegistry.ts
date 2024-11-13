import { Redis, RedisOptions } from 'ioredis';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import {
  NetworkIdType,
  uniformTokenAddress,
  UniTokenAddress,
} from '@sonarwatch/portfolio-core';
import { Logger } from './Logger';
import Fetcher from './Fetcher';
import { Job } from './Job';
import { Token } from './types';
import { TtlMap } from './TtlMap';
import { defaultTransformToken } from './misc';
import tokenSchema from './tokenSchema';

// Prepare AJV
const ajv = new Ajv();
addFormats(ajv);
const validateToken = ajv.compile(tokenSchema);

export type TokenRegistryConfig = {
  logger?: Logger;
  redisOptions: RedisOptions;
  fetchers: Partial<Record<NetworkIdType, Fetcher>>;
  jobs: Job[];
  redisTtlMs?: number;
  memoryTtlMs?: number;
  transformToken?: (token: Token) => Promise<Token>;
};

export class TokenRegistry {
  private logger: Logger | undefined;
  private redisClient: Redis;
  private fetchers: Partial<Record<NetworkIdType, Fetcher>>;
  private jobs: Job[];
  private redisTtl: number;
  private memoryTtl: number;
  private ttlMap: TtlMap<string, Token | null>;
  private transformToken: (token: Token) => Promise<Token>;

  constructor(config: TokenRegistryConfig) {
    this.logger = config.logger;
    this.fetchers = config.fetchers;
    this.jobs = config.jobs;
    this.transformToken = config.transformToken || defaultTransformToken;

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
  }

  async getToken(
    networkId: NetworkIdType,
    address: string
  ): Promise<Token | null> {
    const uniTokAddress = uniformTokenAddress(address, networkId);
    const key = `token:${networkId}:${uniTokAddress}`;

    // Check ttlMap
    const memoryToken = await this.ttlMap.get(key);
    if (memoryToken !== undefined) return memoryToken;

    // Check Redis cache first
    const redisToken = await this.redisClient.get(key);
    if (redisToken !== null) return JSON.parse(redisToken) as Token | null;

    // Fetch if not in cache
    const token = await this.fetch(networkId, uniTokAddress);
    this.ttlMap.set(key, token);
    await this.redisClient.set(key, JSON.stringify(token), 'EX', this.redisTtl);
    return token;
  }

  private async fetch(
    networkId: NetworkIdType,
    address: UniTokenAddress
  ): Promise<Token | null> {
    if (!this.fetchers[networkId])
      throw new Error(`Fetcher network is not configured: ${networkId}`);
    let token = await this.fetchers[networkId].fetch(address);
    if (token) token = await this.transformToken(token);
    const valid = validateToken(token);
    if (!valid) token = null;
    return token;
  }

  async disconnect(): Promise<void> {
    try {
      this.ttlMap.stopCleanup();
      await this.redisClient.quit();
    } catch (error) {
      this.logger?.error('TokenRegistry error disconnecting from Redis', error);
    }
  }
}
