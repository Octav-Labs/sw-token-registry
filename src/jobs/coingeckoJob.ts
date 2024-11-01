import { NetworkIdType } from '@sonarwatch/portfolio-core';
import { Job } from '../Job';

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

function getCoingeckoJob(network: NetworkIdType) {
  const d = coingeckoPlatformFromNetworkId(network);
  console.log('d:', d);
  const coingeckoJob: Job = async () => [
    {
      address: '',
      chainId: 101,
      decimals: 1,
      name: '',
      symbol: '',
    },
  ];
  return coingeckoJob;
}

export default getCoingeckoJob;
