import { NetworkId, NetworkIdType } from '@sonarwatch/portfolio-core';
import Fetcher from './Fetcher';
import { EvmFetcher, SolanaFetcher } from './fetchers';
import { Job } from './Job';
import { jupiterJob } from './jobs';
import { Token } from './types';
import getCoingeckoJob from './jobs/coingeckoJob';
import SuiFetcher from './fetchers/sui';

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
};

export function defaultTransformToken(token: Token): Token {
  return token;
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
  };
}

export function stringToBoolean(str: string): boolean {
  return str === 'true';
}
