import { NetworkId, NetworkIdType } from '@sonarwatch/portfolio-core';
import Fetcher from '../Fetcher';
import { EvmFetcher, SolanaFetcher } from '../fetchers';
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
