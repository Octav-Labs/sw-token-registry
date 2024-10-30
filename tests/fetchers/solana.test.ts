import SolanaFetcher from '../../src/fetchers/solana';

describe('SolanaFetcher', () => {
  const dasUrl = process.env.SOLANA_DAS;
  if (!dasUrl) return;

  let fetcher: SolanaFetcher;

  beforeEach(() => {
    fetcher = new SolanaFetcher(dasUrl);
  });

  it('should return null if token doesnt exists', async () => {
    const address = 'address_that_doesnt_exist';
    const tokenInfo = await fetcher.fetch(address);
    expect(tokenInfo).toBe(null);
  });

  it('should return PYTH token', async () => {
    const address = 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3';
    const tokenInfo = await fetcher.fetch(address);
    expect(tokenInfo).not.toBeNull();
  });
});
