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
  let polygonRpc: string | undefined;
  let avalancheRpc: string | undefined;
  let bnbRpc: string | undefined;
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
    polygonRpc = process.env.POLYGON_RPC;
    avalancheRpc = process.env.AVALANCHE_RPC;
    bnbRpc = process.env.BNB_RPC;

    if (
      !dasUrl ||
      !aptosRpc ||
      !ethRpc ||
      !suiRpc ||
      !polygonRpc ||
      !avalancheRpc ||
      !bnbRpc ||
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
      avalanche: { rpc: avalancheRpc },
      polygon: { rpc: polygonRpc },
      bnb: { rpc: bnbRpc },
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
      memoryTtlMs: 100,
      redisTtlMs: 100,
    });

    // Expect the function to throw an error
    await expect(
      tokenRegistry.getToken(
        '1112223334445555666777888uuuuuuuuuuuuuuuuuu',
        NetworkId.ethereum
      )
    ).rejects.toThrow();

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
      sourceId: 'foosource',
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
    await sleep(7000);
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
        sourceId: 'foosource',
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
    await sleep(3000);
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
    await tokenRegistry.disconnect();
    await sleep(4000);
  });
});
