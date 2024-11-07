import { TokenRegistry } from '../src/TokenRegistry';
import { getDefaultFetchers } from '../src/misc';

describe('TokenRegistry', () => {
  it('sould be instantiable', async () => {
    const fetchers = getDefaultFetchers({
      solana: { dasUrl: 'https://foo.com' },
      ethereum: { rpc: 'https://foo.com' },
      sui: { rpc: 'https://foo.com' },
    });
    const tokenRegistry = new TokenRegistry({
      fetchers,
      redisOptions: {},
      jobs: [],
    });
    await tokenRegistry.disconnect();
    expect(tokenRegistry).toBeDefined();
  });
});
