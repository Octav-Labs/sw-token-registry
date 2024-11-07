import AptosFetcher from '../../src/fetchers/aptos';

describe('aptosFetcher', () => {
  const rpc = process.env.APTOS_RPC;
  if (!rpc) throw new Error('APTOS_RPC env is missing');

  let fetcher: AptosFetcher;

  beforeEach(() => {
    fetcher = new AptosFetcher(rpc);
  });

  it('should return null if token address is not valid', async () => {
    const tokenInfo1 = await fetcher.fetch('address_that_doesnt_exist');
    expect(tokenInfo1).toBe(null);

    const tokenInfo2 = await fetcher.fetch('address::that::doesnt::exist');
    expect(tokenInfo2).toBe(null);
  });

  it('should return null if address is valid but not a token', async () => {
    const tokenInfo1 = await fetcher.fetch(
      '0xada35ada7e43e2ee1c39633ffccec38b76ce702b4efc2e60b50f63fbe4f710d5::apetos_token::ApetosCoin'
    );
    expect(tokenInfo1).toBe(null);

    const tokenInfo2 = await fetcher.fetch(
      '0x2ebb2ccac5e027a87fa0e2e5f656a3a4238d6a48d93ec9b610d570fc0aa0df13'
    );
    expect(tokenInfo2).toBe(null);
  });

  it('should return APE token', async () => {
    const address =
      '0xada35ada7e43e2ee1c39633ffccec38b76ce702b4efc2e60b50f63fbe4f710d8::apetos_token::ApetosCoin';
    const tokenInfo = await fetcher.fetch(address);
    expect(tokenInfo).not.toBeNull();
    expect(tokenInfo?.symbol).toBe('APE');
    expect(tokenInfo?.chainId).toBe(1);
    expect(tokenInfo?.decimals).toBe(8);
  });

  it('should return CELL token', async () => {
    const address =
      '0x2ebb2ccac5e027a87fa0e2e5f656a3a4238d6a48d93ec9b610d570fc0aa0df12';
    const tokenInfo = await fetcher.fetch(address);
    expect(tokenInfo).not.toBeNull();
    expect(tokenInfo?.symbol).toBe('CELL');
    expect(tokenInfo?.chainId).toBe(1);
    expect(tokenInfo?.decimals).toBe(8);
  });
});
