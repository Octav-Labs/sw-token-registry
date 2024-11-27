import { TokenRegistry } from '../src/TokenRegistry';
import { getDefaultFetchers } from '../src/helpers/getDefaultFetchers';

describe('TokenRegistry', () => {
  it('sould be instantiable', async () => {
    const fetchers = getDefaultFetchers({
      solana: { dasUrl: 'https://foo.com' },
      ethereum: { rpc: 'https://foo.com' },
      sui: { rpc: 'https://foo.com' },
      aptos: { rpc: 'https://foo.com' },
    });
    const tokenRegistry = new TokenRegistry({
      fetchers,
      redisOptions: {
        lazyConnect: true,
      },
    });
    await tokenRegistry.disconnect();
    expect(tokenRegistry).toBeDefined();
  });
});
