import { Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import {
  isMoveAddress,
  NetworkId,
  uniformMoveTokenAddress,
} from '@sonarwatch/portfolio-core';
import Fetcher from '../Fetcher';
import { RawToken } from '../types';
import urlToUrlWithHeaders from '../helpers/urlToUrlWithHeaders';
import { constTokensMap } from '../tokens/constTokens';
import { getKey } from '../helpers/getKey';

const coinInfo = '0x1::coin::CoinInfo';
function getCoinAddressFromCoinType(coinType: string) {
  const coinAddress = coinType.split('::').at(0);
  if (!coinAddress) throw new Error('coinType is not valid');
  return coinAddress;
}

type CoinMetadata = {
  decimals?: number;
  icon_uri?: string;
  name?: string;
  project_uri?: string;
  symbol?: string;
};

export default class AptosFetcher extends Fetcher {
  public readonly id: string = 'aptos';
  private client: Aptos;

  constructor(rpc: string) {
    super();
    const urlWithHeaders = urlToUrlWithHeaders(rpc);
    const config = new AptosConfig({
      network: Network.MAINNET,
      clientConfig: {
        HEADERS: urlWithHeaders.headers,
      },
      fullnode: urlWithHeaders.url,
    });
    this.client = new Aptos(config);
  }

  protected uniformTokenAddress(address: string): string {
    return uniformMoveTokenAddress(address);
  }

  async _fetch(address: string): Promise<RawToken | null> {
    const cToken = constTokensMap.get(getKey(address, NetworkId.aptos));
    if (cToken) return cToken;

    const isFungible = address.split('::').length === 1;

    let coinMetadata: CoinMetadata | void;
    if (isFungible) {
      if (!isMoveAddress(address)) return null;
      coinMetadata = await this.client.account
        .getAccountResource<CoinMetadata>({
          accountAddress: getCoinAddressFromCoinType(address),
          resourceType: '0x1::fungible_asset::Metadata',
        })
        .catch((e) => {
          if (!e.status || e.status !== 404) throw e;
        });
    } else {
      const accountAddress = getCoinAddressFromCoinType(address);
      if (!isMoveAddress(accountAddress)) return null;
      coinMetadata = await this.client.account
        .getAccountResource<CoinMetadata>({
          accountAddress,
          resourceType: `${coinInfo}<${address}>`,
        })
        .catch((e) => {
          if (!e.status || e.status !== 404) throw e;
        });
    }
    if (!coinMetadata) return null;

    const { name, symbol, decimals, icon_uri: logoURI } = coinMetadata;
    if (!name || !symbol || decimals === undefined) return null;

    return {
      address,
      chainId: 1,
      decimals,
      name,
      symbol,
      logoURI,
      networkId: NetworkId.aptos,
    };
  }
}
