import {
  NetworkId,
  NetworkIdType,
  uniformTokenAddress,
} from '@sonarwatch/portfolio-core';
import Fetcher from '../Fetcher';
import { EvmFetcher, SolanaFetcher } from '../fetchers';
import { Job } from '../Job';
import { jupiterJob } from '../jobs';
import { Token } from '../types';
import getCoingeckoJob from '../jobs/coingeckoJob';
import SuiFetcher from '../fetchers/sui';
import AptosFetcher from '../fetchers/aptos';

export type GetDefaultFetchersConfig = {
  solana: {
    dasUrl: string;
  };
  ethereum: {
    rpc: string;
  };
  sui: {
    rpc: string;
  };
  aptos: {
    rpc: string;
  };
};

export async function defaultTransformToken(token: Token): Promise<Token> {
  const name = token.name
    .normalize('NFKC')
    .replaceAll('\\', '')
    .replaceAll('\t', '')
    .replaceAll('\n', '')
    .replace(/[\uFE70-\uFEFF]/g, '')
    .replace(/[\uFFF0-\uFFFF]/g, '')
    .trim()
    .substring(0, 64);

  const symbol = token.symbol
    .replace(/[^\x20-\x7F]/g, '')
    .trim()
    .replaceAll(' ', '')
    .substring(0, 20);

  const nToken: Token = {
    ...token,
    symbol,
    name,
    address: uniformTokenAddress(token.address, token.networkId),
  };

  return nToken;
}

export function getDefaultJobs(): Job[] {
  return [getCoingeckoJob(NetworkId.ethereum), jupiterJob];
}

export function getDefaultFetchers(
  config: GetDefaultFetchersConfig
): Partial<Record<NetworkIdType, Fetcher>> {
  return {
    solana: new SolanaFetcher(config.solana.dasUrl),
    ethereum: new EvmFetcher(config.ethereum.rpc, NetworkId.ethereum),
    sui: new SuiFetcher(config.sui.rpc),
    aptos: new AptosFetcher(config.aptos.rpc),
  };
}

export function stringToBoolean(str: string): boolean {
  return str === 'true';
}

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

export function coingeckoPlatformFromNetworkId(networkId: NetworkIdType) {
  const platform = platforms[networkId];
  if (!platform) throw new Error('Platform is missing');
  return platform;
}
