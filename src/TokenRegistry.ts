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
import { Token } from './types';
import { TtlMap } from './TtlMap';
import tokenSchema from './tokenSchema';
import { defaultTransformToken } from './helpers/defaultTransformToken';
import runInBatch from './helpers/misc';

// Prepare AJV
const ajv = new Ajv();
addFormats(ajv);
const ajvToken = ajv.compile(tokenSchema);

export type TokenRegistryConfig = {
  logger?: Logger;
  redisOptions: RedisOptions;
  fetchers: Partial<Record<NetworkIdType, Fetcher>>;
  redisTtlMs?: number;
  memoryTtlMs?: number;
  transformToken?: (token: Token) => Promise<Token>;
};

export class TokenRegistry {
  private logger: Logger | undefined;
  private redisClient: Redis;
  private fetchers: Partial<Record<NetworkIdType, Fetcher>>;
  private redisTtl: number;
  private memoryTtl: number;
  private ttlMap: TtlMap<string, Token | null>;
  private transformToken: (token: Token) => Promise<Token>;

  constructor(config: TokenRegistryConfig) {
    this.logger = config.logger;
    this.fetchers = config.fetchers;
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

  static getKey(address: string, networkId: NetworkIdType) {
    const uniTokAddress = uniformTokenAddress(address, networkId);
    return `token:${networkId}:${uniTokAddress}`;
  }

  public async addToken(
    address: string,
    networkId: NetworkIdType,
    token: Token | null
  ): Promise<void> {
    const vToken = await this.validateToken(token);
    await this.saveToken(address, networkId, vToken);
  }

  public async getToken(
    address: string,
    networkId: NetworkIdType
  ): Promise<Token | null> {
    const key = TokenRegistry.getKey(address, networkId);

    // Check ttlMap
    const memoryToken = await this.ttlMap.get(key);
    if (memoryToken !== undefined) return memoryToken;

    // Check Redis cache first
    const redisToken = await this.redisClient.get(key);
    if (redisToken !== null) return JSON.parse(redisToken) as Token | null;

    // Fetch if not in cache
    const token = await this.fetch(networkId, address);
    await this.saveToken(address, networkId, token);
    return token;
  }

  public async getTokens(
    items: { address: string; networkId: NetworkIdType }[]
  ): Promise<(Token | null)[]> {
    const res = await runInBatch(
      items.map((i) => () => this.getToken(i.address, i.networkId)),
      20
    );
    return res.map((r, i) => {
      if (r.status === 'rejected') {
        this.logger?.warn(
          `Failed to get token: ${items[i].address} |${items[i].networkId}  `
        );
        return null;
      }
      return r.value;
    });
  }

  private async fetch(
    networkId: NetworkIdType,
    address: UniTokenAddress
  ): Promise<Token | null> {
    if (!this.fetchers[networkId])
      throw new Error(`Fetcher network is not configured: ${networkId}`);

    const uniTokAddress = uniformTokenAddress(address, networkId);
    const token = await this.fetchers[networkId].fetch(uniTokAddress);
    return this.validateToken(token);
  }

  private async validateToken(token: Token | null): Promise<Token | null> {
    if (token === null) return null;

    const tToken = await this.transformToken(token);
    const valid = ajvToken(tToken);
    if (!valid) return null;

    return tToken;
  }

  private async saveToken(
    address: string,
    networkId: NetworkIdType,
    token: Token | null
  ): Promise<void> {
    const key = TokenRegistry.getKey(address, networkId);
    this.ttlMap.set(key, token);
    await this.redisClient.set(key, JSON.stringify(token), 'EX', this.redisTtl);
  }

  public async disconnect(): Promise<void> {
    try {
      this.ttlMap.stopCleanup();
      await this.redisClient.quit();
    } catch (error) {
      this.logger?.error('TokenRegistry error disconnecting from Redis', error);
    }
  }
}
