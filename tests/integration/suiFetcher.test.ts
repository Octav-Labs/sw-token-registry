import SuiFetcher from '../../src/fetchers/sui';

describe('suiFetcher', () => {
  const rpc = process.env.SUI_RPC;
  if (!rpc) throw new Error('SUI_RPC env is missing');

  let fetcher: SuiFetcher;

  beforeEach(() => {
    fetcher = new SuiFetcher(rpc);
  });

  it('should return null if token address is not valid', async () => {
    const address = 'address_that_doesnt_exist';
    const tokenInfo = await fetcher.fetch(address);
    expect(tokenInfo).toBe(null);
  });

  it('should return null if address is valid but not a token', async () => {
    const tokenInfo = await fetcher.fetch(
      '0x5f3a18cdfd7ef0527a65ba5c07dbe0efe276507d4d1a4d1bebe87f5d40df6cf6::boby::BOBY'
    );
    expect(tokenInfo).toBe(null);

    const tokenInfo2 = await fetcher.fetch(
      '0x5f3a18cdfd7ef0527a65ba5c07dbe0efe276507d4d1a4d1bebe87f5d40df6cf5::boby::BOBY'
    );
    expect(tokenInfo2).toBe(null);
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

  it('should return SCALLOP AF SUI token', async () => {
    const tokenInfo = await fetcher.fetch(
      '0x671b1fa2a124f5be8bdae8b91ee711462c5d9e31bda232e70fd9607b523c88::scallop_af_sui::SCALLOP_AF_SUI'
    );
    expect(tokenInfo).not.toBeNull();
    expect(tokenInfo?.symbol).toBe('sAfSUI');
    expect(tokenInfo?.chainId).toBe(1);
    expect(tokenInfo?.decimals).toBe(9);

    const tokenInfo2 = await fetcher.fetch(
      '671b1fa2a124f5be8bdae8b91ee711462c5d9e31bda232e70fd9607b523c88::scallop_af_sui::SCALLOP_AF_SUI'
    );
    expect(tokenInfo2).not.toBeNull();
    expect(tokenInfo2?.symbol).toBe('sAfSUI');
  });
});
