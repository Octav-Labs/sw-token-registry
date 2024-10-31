import { TokenRegistry } from '../src/TokenRegistry';
import { getDefaultFetchers } from '../src/helpers';

describe('TokenRegistry', () => {
  it('sould be instantiable', async () => {
    const fetchers = getDefaultFetchers({
      solana: { dasUrl: '' },
      ethereum: { rpc: '' },
    });
    const tokenRegistry = new TokenRegistry({
      fetchers,
      redisOptions: {},
      jobs: [],
    });
    expect(tokenRegistry).toBeDefined();
  });
});
