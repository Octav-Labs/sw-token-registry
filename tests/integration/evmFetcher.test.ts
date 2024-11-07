import { NetworkId } from '@sonarwatch/portfolio-core';
import EvmFetcher from '../../src/fetchers/evm';

describe('evmFetcher', () => {
  const rpc = process.env.ETHEREUM_RPC;
  if (!rpc) throw new Error('ETHEREUM_RPC env is missing');

  let fetcher: EvmFetcher;

  beforeEach(() => {
    fetcher = new EvmFetcher(rpc, NetworkId.ethereum);
  });

  it('should return null if token doesnt exists', async () => {
    const address = 'address_that_doesnt_exist';
    const tokenInfo = await fetcher.fetch(address);
    expect(tokenInfo).toBe(null);
  });

  it('should return USDC token', async () => {
    const address = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
    const tokenInfo = await fetcher.fetch(address);
    expect(tokenInfo).not.toBeNull();
    expect(tokenInfo?.symbol).toBe('USDC');
    expect(tokenInfo?.chainId).toBe(1);
    expect(tokenInfo?.decimals).toBe(6);
  });
});
