import {
  bitcoinNetwork,
  NetworkId,
  uniformBitcoinTokenAddress,
} from '@sonarwatch/portfolio-core';
import Fetcher from '../Fetcher';
import { RawToken } from '../types';

export default class BitcoinFetcher extends Fetcher {
  public readonly id: string = 'bitcoin';
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {
    super();
  }

  protected uniformTokenAddress(address: string): string {
    return uniformBitcoinTokenAddress(address);
  }

  // eslint-disable-next-line class-methods-use-this
  async _fetch(address: string): Promise<RawToken | null> {
    if (address !== bitcoinNetwork.native.address) return null;

    return {
      chainId: 1,
      address,
      decimals: 8,
      name: 'Bitcoin',
      symbol: 'BTC',
      logoURI:
        'https://raw.githubusercontent.com/sonarwatch/token-registry/main/img/common/BTC.webp',
      networkId: NetworkId.bitcoin,
    };
  }
}
