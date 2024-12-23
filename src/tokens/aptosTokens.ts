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
  {
    address:
      '0x5e156f1207d0ebfa19a9eeff00d62a282278fb8719f4fab3a586a0a2c0fffbea::coin::T',
    decimals: 6,
    name: 'USD Coin (Wormhole from Ethereum)',
    symbol: 'wUSDC',
    logoURI:
      'https://raw.githubusercontent.com/sonarwatch/token-registry/main/img/common/USDC.webp',
    networkId: NetworkId.aptos,
  },
  {
    address:
      '0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC',
    decimals: 6,
    name: 'USD Coin (LayerZero)',
    symbol: 'zUSDC',
    logoURI:
      'https://raw.githubusercontent.com/sonarwatch/token-registry/main/img/common/USDC.webp',
    networkId: NetworkId.aptos,
  },
];
