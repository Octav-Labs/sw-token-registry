import SuiFetcher from '../../src/fetchers/sui';

describe('suiFetcher', () => {
  const rpc = process.env.SUI_RPC;
  if (!rpc) throw new Error('SUI_RPC env is missing');

  let fetcher: SuiFetcher;

  beforeEach(() => {
    fetcher = new SuiFetcher(rpc);
  });

  it('should return null if token doesnt exists', async () => {
    const address = 'address_that_doesnt_exist';
    const tokenInfo = await fetcher.fetch(address);
    expect(tokenInfo).toBe(null);
  });

  it('should return BOB token', async () => {
    const address =
      '0x5f3a18cdfd7ef0527a65ba5c07dbe0efe276507d4d1a4d1bebe87f5d40df6cf6::bob::BOB';
    const tokenInfo = await fetcher.fetch(address);
    expect(tokenInfo).not.toBeNull();
    expect(tokenInfo?.symbol).toBe('BOB');
    expect(tokenInfo?.chainId).toBe(1);
    expect(tokenInfo?.decimals).toBe(6);
  });
});
