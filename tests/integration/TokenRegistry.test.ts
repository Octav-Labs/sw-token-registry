import { NetworkId } from '@sonarwatch/portfolio-core';
import { TokenRegistry } from '../../src/TokenRegistry';
import { getDefaultFetchers } from '../../src/helpers/getDefaultFetchers';

describe('TokenRegistry', () => {
  it('sould be instantiable', async () => {
    // Redis
    const redisHost = process.env.REDIS_HOST;
    const redisTls = process.env.REDIS_TLS;
    const redisDb = process.env.REDIS_DB;
    const redisUsername = process.env.REDIS_USERNAME;
    const redisPassword = process.env.REDIS_PASSWORD;
    const redisPort = process.env.REDIS_PORT;

    // Fetchers
    const dasUrl = process.env.SOLANA_DAS;
    const aptosRpc = process.env.APTOS_RPC;
    const ethRpc = process.env.ETHEREUM_RPC;
    const suiRpc = process.env.SUI_RPC;
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

    const fetchers = getDefaultFetchers({
      solana: { dasUrl },
      ethereum: { rpc: ethRpc },
      sui: { rpc: suiRpc },
      aptos: { rpc: aptosRpc },
    });
    const tokenRegistry = new TokenRegistry({
      fetchers,
      redisOptions: {
        host: redisHost,
        port: Number(redisPort),
        username: redisUsername,
        password: redisPassword,
        db: Number(redisDb),
        tls: redisTls === 'true' ? {} : undefined,
      },
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
  });
});
