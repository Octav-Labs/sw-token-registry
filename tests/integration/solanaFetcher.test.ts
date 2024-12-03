import SolanaFetcher from '../../src/fetchers/solana';

describe('SolanaFetcher', () => {
  const dasUrl = process.env.SOLANA_DAS;
  if (!dasUrl) throw new Error('SOLANA_DAS env is missing');

  let fetcher: SolanaFetcher;

  beforeEach(() => {
    fetcher = new SolanaFetcher(dasUrl);
  });

  it('should return null if token address is not valid', async () => {
    const address = 'address_that_doesnt_exist';
    const tokenInfo = await fetcher.fetch(address);
    expect(tokenInfo).toBe(null);
  });

  it('should return null if address is valid but not a token', async () => {
    const address = '1112223334445555666777888uuuuuuuuuuuuuuuuuu';
    const tokenInfo = await fetcher.fetch(address);
    expect(tokenInfo).toBe(null);
  });

  it('should return wSOL token', async () => {
    const address = 'So11111111111111111111111111111111111111112';
    const tokenInfo = await fetcher.fetch(address);
    expect(tokenInfo).not.toBeNull();
    expect(tokenInfo?.symbol).toBe('wSOL');
    expect(tokenInfo?.chainId).toBe(101);
    expect(tokenInfo?.decimals).toBe(9);
  });

  it('should return SOL token', async () => {
    const address = '11111111111111111111111111111111';
    const tokenInfo = await fetcher.fetch(address);
    expect(tokenInfo).not.toBeNull();
    expect(tokenInfo?.symbol).toBe('SOL');
    expect(tokenInfo?.chainId).toBe(101);
    expect(tokenInfo?.decimals).toBe(9);
  });

  it('should return PYTH token', async () => {
    const address = 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3';
    const tokenInfo = await fetcher.fetch(address);
    expect(tokenInfo).not.toBeNull();
    expect(tokenInfo?.symbol).toBe('PYTH');
    expect(tokenInfo?.chainId).toBe(101);
    expect(tokenInfo?.decimals).toBe(6);
  });

  it('should return SONAR token', async () => {
    const address = 'sonarX4VtVkQemriJeLm6CKeW3GDMyiBnnAEMw1MRAE';
    const tokenInfo = await fetcher.fetch(address);
    expect(tokenInfo).not.toBeNull();
    expect(tokenInfo?.symbol).toBe('SONAR');
    expect(tokenInfo?.chainId).toBe(101);
    expect(tokenInfo?.decimals).toBe(9);
  });
});
