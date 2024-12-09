import axios, { AxiosResponse } from 'axios';
import {
  NetworkId,
  uniformSolanaTokenAddress,
} from '@sonarwatch/portfolio-core';
import Fetcher from '../Fetcher';
import { RawToken } from '../types';
import { isImageUrl } from '../helpers/isImageUrl';
import { constTokensMap } from '../tokens/constTokens';
import { getKey } from '../helpers/getKey';

type DasGetAsset = {
  error?: unknown;
  result?: {
    token_info?: {
      decimals?: number;
      symbol?: string;
    };
    content: {
      links?: {
        image?: string;
      };
      json_uri?: string;
      metadata?: {
        description?: string;
        name?: string;
        symbol?: string;
        token_standard?: string;
      };
    };
  };
};

export default class SolanaFetcher extends Fetcher {
  public readonly id: string = 'solana';
  private dasUrl: string;

  constructor(dasUrl: string) {
    super();
    this.dasUrl = dasUrl;
  }
  protected uniformTokenAddress(address: string): string {
    return uniformSolanaTokenAddress(address);
  }

  async _fetch(address: string): Promise<RawToken | null> {
    const cToken = constTokensMap.get(getKey(address, NetworkId.solana));
    if (cToken) return cToken;

    const res: AxiosResponse<DasGetAsset> = await axios.post(this.dasUrl, {
      jsonrpc: '2.0',
      id: 'text',
      method: 'getAsset',
      params: { id: address },
    });

    if (res.data.error) return null;
    if (!res.data.result) return null;
    if (res.data.result.token_info?.decimals === undefined) return null;

    const symbol =
      res.data.result.content.metadata?.symbol ||
      res.data.result.token_info?.symbol ||
      res.data.result.content.metadata?.name;
    const name =
      res.data.result.content.metadata?.name ||
      res.data.result.token_info?.symbol;
    if (!symbol || !name) return null;

    let logoURI = res.data.result.content.links?.image;
    if (!logoURI) {
      const isJsonUriAnImg = await isImageUrl(res.data.result.content.json_uri);
      if (isJsonUriAnImg) logoURI = res.data.result.content.json_uri;
    }

    return {
      address,
      chainId: 101,
      decimals: res.data.result.token_info.decimals,
      name,
      symbol,
      logoURI,
      networkId: NetworkId.solana,
    };
  }
}
