import axios from 'axios';
import { NetworkIdType } from '@sonarwatch/portfolio-core';
import Fetcher from '../Fetcher';
import { Token } from '../types';

const platforms: Record<string, string> = {
  aptos: 'aptos',
  avalanche: 'avalanche',
  bnb: 'binance-smart-chain',
  arbitrum: 'arbitrum-one',
  base: 'base',
  cronos: 'cronos',
  gnosis: 'xdai',
  linea: 'linea',
  scroll: 'scroll',
  zksync: 'zksync',
  'polygon-zkevm': 'polygon-zkevm',
  ethereum: 'ethereum',
  optimism: 'optimistic-ethereum',
  polygon: 'polygon-pos',
  solana: 'solana',
  sui: 'sui',
  sei: 'sei',
};

function coingeckoPlatformFromNetworkId(networkId: NetworkIdType) {
  const platform = platforms[networkId];
  if (!platform) throw new Error('Platform is missing');
  return platform;
}

export default class EvmFetcher extends Fetcher {
  private rpc: string;
  private coingeckoPlatform: string;
  private networkId: string;

  constructor(rpc: string, network: NetworkIdType) {
    super();
    this.rpc = rpc;
    this.coingeckoPlatform = coingeckoPlatformFromNetworkId(network);
    this.networkId = network;
  }

  async fetch(address: string): Promise<Token | null> {
    const res = await axios.post(this.rpc, {
      jsonrpc: '2.0',
      id: 'text',
      method: 'getAsset',
      params: { id: address },
    });
    return res.data;
  }
}
