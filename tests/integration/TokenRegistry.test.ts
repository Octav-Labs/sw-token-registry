import { NetworkId, NetworkIdType } from '@sonarwatch/portfolio-core';
import { RedisOptions } from 'ioredis';
import { TokenRegistry } from '../../src/TokenRegistry';
import { getDefaultFetchers } from '../../src/helpers/getDefaultFetchers';
import { sleep } from '../../src/helpers/misc';
import Fetcher from '../../src/Fetcher';

describe('TokenRegistry', () => {
  let redisHost: string | undefined;
  let redisTls: string | undefined;
  let redisDb: string | undefined;
  let redisUsername: string | undefined;
  let redisPassword: string | undefined;
  let redisPort: string | undefined;
  let dasUrl: string | undefined;
  let aptosRpc: string | undefined;
  let ethRpc: string | undefined;
  let suiRpc: string | undefined;
  let fetchers: Partial<Record<NetworkIdType, Fetcher>>;
  let redisOptions: RedisOptions;

  beforeEach(() => {
    // Redis
    redisHost = process.env.REDIS_HOST;
    redisTls = process.env.REDIS_TLS;
    redisDb = process.env.REDIS_DB;
    redisUsername = process.env.REDIS_USERNAME;
    redisPassword = process.env.REDIS_PASSWORD;
    redisPort = process.env.REDIS_PORT;

    // Fetchers
    dasUrl = process.env.SOLANA_DAS;
    aptosRpc = process.env.APTOS_RPC;
    ethRpc = process.env.ETHEREUM_RPC;
    suiRpc = process.env.SUI_RPC;
    if (
      !dasUrl ||
      !aptosRpc ||
      !ethRpc ||
      !suiRpc ||
      !redisHost ||
      !redisTls ||
      !redisUsername ||
      !redisPassword ||
      !redisPort ||
      !redisDb
    )
      throw new Error('Some envs are missing');

    fetchers = getDefaultFetchers({
      solana: { dasUrl },
      ethereum: { rpc: ethRpc },
      sui: { rpc: suiRpc },
      aptos: { rpc: aptosRpc },
    });

    redisOptions = {
      host: redisHost,
      port: Number(redisPort),
      username: redisUsername,
      password: redisPassword,
      db: Number(redisDb),
      tls: redisTls === 'true' ? {} : undefined,
    };
  });

  it('sould be instantiable', async () => {
    const tokenRegistry = new TokenRegistry({
      fetchers,
      redisOptions,
    });

    const shibaToken = await tokenRegistry.getToken(
      '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
      NetworkId.ethereum
    );

    const jupToken = await tokenRegistry.getToken(
      'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',
      NetworkId.solana
    );

    // Expect the function to throw an error
    await expect(
      tokenRegistry.getToken(
        '1112223334445555666777888uuuuuuuuuuuuuuuuuu',
        NetworkId.ethereum
      )
    ).rejects.toThrow();

    expect(shibaToken).not.toBeNull();
    expect(jupToken).not.toBeNull();
    expect(tokenRegistry).toBeDefined();
    await tokenRegistry.disconnect();
    await sleep(200);
  });

  it('sould refetch item due to expiracy', async () => {
    const tokenRegistry = new TokenRegistry({
      fetchers,
      redisOptions,
      memoryTtlMs: 3000,
      redisTtlMs: 6000,
    });
    const address =
      '0x1111111111111111111112222222222222222222223333333333333333333333::FOO::foo';
    await tokenRegistry.addToken(address, NetworkId.aptos, {
      address,
      networkId: NetworkId.aptos,
      chainId: 1,
      decimals: 1,
      name: 'Foo token',
      symbol: 'FOO',
    });
    const tokenMemory = await tokenRegistry.getToken(address, NetworkId.aptos);
    await sleep(3100);
    const tokenRedis = await tokenRegistry.getToken(address, NetworkId.aptos);
    await sleep(3100);
    const tokenOnChain = await tokenRegistry.getToken(address, NetworkId.aptos);

    expect(tokenMemory).not.toBeNull();
    expect(tokenRedis).not.toBeNull();
    expect(tokenOnChain).toBeNull();
    await tokenRegistry.disconnect();
    await sleep(200);
  });

  it('sould paginate', async () => {
    const tokenRegistry = new TokenRegistry({
      fetchers,
      redisOptions,
      memoryTtlMs: 2000,
      redisTtlMs: 2000,
    });
    const networkId = NetworkId.solana;

    const address1 = 't111111111111111111111111111111111111111111';
    const address2 = 't222222222222222222222222222222222222222222';
    const address3 = 't333333333333333333333333333333333333333333';
    const address4 = 't444444444444444444444444444444444444444444';
    const address5 = 't555555555555555555555555555555555555555555';
    const address6 = 't666666666666666666666666666666666666666666';
    function getToken(address: string, i: number) {
      return {
        address,
        networkId,
        chainId: 1,
        decimals: 6,
        name: `Token#${i}`,
        symbol: `T${i}`,
      };
    }

    const res0 = await tokenRegistry.getTokensPaginate(0, 2);
    expect(res0.values.length).toBe(0);

    await tokenRegistry.addToken(address1, networkId, getToken(address1, 1));
    await tokenRegistry.addToken(address2, networkId, getToken(address2, 2));
    await tokenRegistry.addToken(address3, networkId, getToken(address3, 3));
    await tokenRegistry.addToken(address4, networkId, getToken(address4, 4));
    await tokenRegistry.addToken(address5, networkId, getToken(address5, 5));
    await tokenRegistry.addToken(address6, networkId, getToken(address6, 6));

    const res1 = await tokenRegistry.getTokensPaginate(0, 2);
    const res2 = await tokenRegistry.getTokensPaginate(res1.nextCursor, 2);

    expect(res1.values.length + res2.values.length).toBeLessThan(10);
    await tokenRegistry.disconnect();
    await sleep(50);
  });

  it('should return HASUI token', async () => {
    const tokenRegistry = new TokenRegistry({
      fetchers,
      redisOptions,
      memoryTtlMs: 1000,
      redisTtlMs: 3000,
    });

    const address =
      '0xbde4ba4c2e274a60ce15c1cfff9e5c42e41654ac8b6d906a57efa4bd3c29f47d::hasui::HASUI';
    const tokenInfo = await tokenRegistry.getToken(address, NetworkId.sui);
    expect(tokenInfo).not.toBeNull();
    expect(tokenInfo?.symbol).toBe('haSUI');
    expect(tokenInfo?.chainId).toBe(1);
    expect(tokenInfo?.decimals).toBe(9);
  });
});
