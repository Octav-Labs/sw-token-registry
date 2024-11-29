import { NetworkId } from '@sonarwatch/portfolio-core';
import EvmFetcher from '../../src/fetchers/evm';

describe('evmFetcher', () => {
  const rpcEth = process.env.ETHEREUM_RPC;
  if (!rpcEth) throw new Error('ETHEREUM_RPC env is missing');
  const rpcPol = process.env.POLYGON_RPC;
  if (!rpcPol) throw new Error('POLYGON_RPC env is missing');
  const rpcAvax = process.env.AVALANCHE_RPC;
  if (!rpcAvax) throw new Error('AVALANCHE_RPC env is missing');
  const rpcBnb = process.env.BNB_RPC;
  if (!rpcBnb) throw new Error('BNB_RPC env is missing');

  let fetcherEth: EvmFetcher;
  let fetcherPol: EvmFetcher;
  let fetcherAvax: EvmFetcher;
  let fetcherBnb: EvmFetcher;

  beforeEach(() => {
    fetcherEth = new EvmFetcher(rpcEth, NetworkId.ethereum);
    fetcherPol = new EvmFetcher(rpcPol, NetworkId.polygon);
    fetcherAvax = new EvmFetcher(rpcAvax, NetworkId.avalanche);
    fetcherBnb = new EvmFetcher(rpcBnb, NetworkId.bnb);
  });

  it('should return null if address is valid but not a token', async () => {
    const address = '0x0000000000000000000000000000000000000123';
    const tokenInfo = await fetcherEth.fetch(address);
    expect(tokenInfo).toBe(null);
  });

  it('should return eth USDC token', async () => {
    const address = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
    const tokenInfo = await fetcherEth.fetch(address);
    expect(tokenInfo).not.toBeNull();
    expect(tokenInfo?.symbol).toBe('USDC');
    expect(tokenInfo?.chainId).toBe(1);
    expect(tokenInfo?.decimals).toBe(6);
  });

  it('should return pol USDC.e token', async () => {
    const address = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174';
    const tokenInfo = await fetcherPol.fetch(address);
    expect(tokenInfo).not.toBeNull();
    expect(tokenInfo?.symbol).toBe('USDC');
    expect(tokenInfo?.chainId).toBe(137);
    expect(tokenInfo?.decimals).toBe(6);
  });

  it('should return pol USDC token', async () => {
    const address = '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359';
    const tokenInfo = await fetcherPol.fetch(address);
    expect(tokenInfo).not.toBeNull();
    expect(tokenInfo?.symbol).toBe('USDC');
    expect(tokenInfo?.chainId).toBe(137);
    expect(tokenInfo?.decimals).toBe(6);
  });

  it('should return avax USDC token', async () => {
    const address = '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e';
    const tokenInfo = await fetcherAvax.fetch(address);
    expect(tokenInfo).not.toBeNull();
    expect(tokenInfo?.symbol).toBe('USDC');
    expect(tokenInfo?.chainId).toBe(43114);
    expect(tokenInfo?.decimals).toBe(6);
  });

  it('should return bnb CAKE token', async () => {
    const address = '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82';
    const tokenInfo = await fetcherBnb.fetch(address);
    expect(tokenInfo).not.toBeNull();
    expect(tokenInfo?.symbol).toBe('Cake');
    expect(tokenInfo?.chainId).toBe(56);
    expect(tokenInfo?.decimals).toBe(18);
  });

  it('should return eth WETH token', async () => {
    const address = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
    const tokenInfo = await fetcherEth.fetch(address);
    expect(tokenInfo).not.toBeNull();
    expect(tokenInfo?.symbol).toBe('WETH');
    expect(tokenInfo?.chainId).toBe(1);
    expect(tokenInfo?.decimals).toBe(18);
  });

  it('should return eth ETH token', async () => {
    const address = '0x0000000000000000000000000000000000000000';
    const tokenInfo = await fetcherEth.fetch(address);
    expect(tokenInfo).not.toBeNull();
    expect(tokenInfo?.symbol).toBe('ETH');
    expect(tokenInfo?.chainId).toBe(1);
    expect(tokenInfo?.decimals).toBe(18);
  });

  it('should return eth ETH.e token', async () => {
    const address = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
    const tokenInfo = await fetcherEth.fetch(address);
    expect(tokenInfo).not.toBeNull();
    expect(tokenInfo?.symbol).toBe('ETH');
    expect(tokenInfo?.chainId).toBe(1);
    expect(tokenInfo?.decimals).toBe(18);
  });

  it('should return bnb WBNB token', async () => {
    const address = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c';
    const tokenInfo = await fetcherBnb.fetch(address);
    expect(tokenInfo).not.toBeNull();
    expect(tokenInfo?.symbol).toBe('WBNB');
    expect(tokenInfo?.chainId).toBe(56);
    expect(tokenInfo?.decimals).toBe(18);
  });
});
