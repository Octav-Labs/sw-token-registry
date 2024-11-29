import {
  EvmNetworkIdType,
  getNetworkById,
  Network,
  uniformEvmTokenAddress,
} from '@sonarwatch/portfolio-core';
import { Chain, createPublicClient, erc20Abi, http, PublicClient } from 'viem';
import { avalanche, bsc, mainnet, polygon } from 'viem/chains';
import Fetcher from '../Fetcher';
import { Token } from '../types';
import urlToUrlWithHeaders from '../helpers/urlToUrlWithHeaders';
import { evmTokensMap } from '../helpers/constants';
import { TokenRegistry } from '../TokenRegistry';

export const viemChainsByNetworkId: Record<EvmNetworkIdType, Chain> = {
  ethereum: mainnet,
  avalanche,
  polygon,
  bnb: bsc,
};

export default class EvmFetcher extends Fetcher {
  readonly networkId: EvmNetworkIdType;
  private client: PublicClient;
  private network: Network;

  constructor(rpc: string, networkId: EvmNetworkIdType) {
    super();

    const chain = viemChainsByNetworkId[networkId];
    const urlWithHeaders = urlToUrlWithHeaders(rpc);
    this.client = createPublicClient({
      chain,
      transport: http(urlWithHeaders.url, {
        fetchOptions: {
          headers: urlWithHeaders.headers,
        },
      }),
    });
    this.networkId = networkId;
    this.network = getNetworkById(networkId);
  }

  protected uniformTokenAddress(address: string): string {
    return uniformEvmTokenAddress(address);
  }

  async _fetch(address: string): Promise<Token | null> {
    const constantToken = evmTokensMap.get(
      TokenRegistry.getKey(address, this.networkId)
    );
    if (constantToken) return constantToken;

    const contracts = [
      {
        abi: erc20Abi,
        address: address as `0x${string}`,
        functionName: 'name',
        args: [],
      },
      {
        abi: erc20Abi,
        address: address as `0x${string}`,
        functionName: 'symbol',
        args: [],
      },
      {
        abi: erc20Abi,
        address: address as `0x${string}`,
        functionName: 'decimals',
        args: [],
      },
    ] as const;
    const multicallRes = await this.client.multicall({ contracts });
    const name = multicallRes[0].result;
    const symbol = multicallRes[1].result;
    const decimals = multicallRes[2].result;

    if (!name || !symbol || decimals === undefined) return null;
    return {
      address,
      chainId: this.network.chainId,
      decimals,
      symbol,
      name,
      networkId: this.networkId,
    };
  }
}
