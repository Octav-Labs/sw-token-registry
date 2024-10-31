import { NetworkIdType } from '@sonarwatch/portfolio-core';
import Fetcher from './Fetcher';
import { EvmFetcher, SolanaFetcher } from './fetchers';
import { Job } from './Job';
import { coingeckoJob, jupiterJob } from './jobs';
import { Token } from './types';

export type GetDefaultFetchersConfig = {
  solana: {
    dasUrl: string;
  };
  ethereum: {
    rpc: string;
  };
};

export function defaultTransformToken(token: Token): Token {
  return token;
}

export function getDefaultJobs(): Job[] {
  return [coingeckoJob, jupiterJob];
}

export function getDefaultFetchers(
  config: GetDefaultFetchersConfig
): Partial<Record<NetworkIdType, Fetcher>> {
  return {
    solana: new SolanaFetcher(config.solana.dasUrl),
    ethereum: new EvmFetcher(config.ethereum.rpc),
  };
}

export function stringToBoolean(str: string): boolean {
  return str === 'true';
}
