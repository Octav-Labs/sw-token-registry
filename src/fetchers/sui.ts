import {
  SuiClient as MystenSuiClient,
  SuiHTTPTransport,
} from '@mysten/sui/client';
import { NetworkId, uniformMoveTokenAddress } from '@sonarwatch/portfolio-core';
import Fetcher from '../Fetcher';
import { Token } from '../types';

export default class SuiFetcher extends Fetcher {
  private client: MystenSuiClient;

  constructor(rpc: string) {
    super();
    this.client = new MystenSuiClient({
      transport: new SuiHTTPTransport({
        url: rpc,
        rpc: {
          headers: {},
        },
      }),
    });
  }

  protected uniformTokenAddress(address: string): string {
    return uniformMoveTokenAddress(address);
  }

  async _fetch(address: string): Promise<Token | null> {
    const res = await this.client
      .getCoinMetadata({ coinType: address })
      .catch((e) => {
        console.log('e:', e);
        if (e.code === -32602 || e.type === 'InvalidParams') {
          return null;
        }
        throw e;
      });
    if (!res) return null;

    return {
      address,
      chainId: 1,
      decimals: res.decimals,
      name: res.name,
      symbol: res.symbol,
      logoURI: res.iconUrl || undefined,
      networkId: NetworkId.sui,
    };
  }
}
