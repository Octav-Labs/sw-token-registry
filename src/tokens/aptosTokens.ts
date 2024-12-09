import { aptosNetwork, NetworkId } from '@sonarwatch/portfolio-core';
import { RawToken } from '../types';

export const aptosTokens: Omit<RawToken, 'chainId'>[] = [
  {
    address: '0x1::aptos_coin::AptosCoin',
    decimals: aptosNetwork.native.decimals,
    name: 'Aptos',
    networkId: NetworkId.aptos,
    symbol: 'APT',
    logoURI:
      'https://raw.githubusercontent.com/sonarwatch/token-registry/main/img/common/APT.webp',
  },
];
