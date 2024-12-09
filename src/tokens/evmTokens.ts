import { NetworkId } from '@sonarwatch/portfolio-core';
import { RawToken } from '../types';

export const evmTokens: Omit<RawToken, 'chainId'>[] = [
  {
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
    logoURI:
      'https://raw.githubusercontent.com/sonarwatch/token-registry/main/img/common/ETH.webp',
    networkId: NetworkId.ethereum,
  },
  {
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
    logoURI:
      'https://raw.githubusercontent.com/sonarwatch/token-registry/main/img/common/ETH.webp',
    networkId: NetworkId.ethereum,
  },
  {
    name: 'Polygon Ecosystem Token',
    address: '0x0000000000000000000000000000000000001010',
    symbol: 'POL',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/sonarwatch/token-registry/main/img/common/MATIC.webp',
    networkId: NetworkId.polygon,
  },
  {
    name: 'Wrapped Polygon Ecosystem Token',
    address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    symbol: 'WPOL',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/sonarwatch/token-registry/main/img/common/MATIC.webp',
    networkId: NetworkId.polygon,
  },
  {
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    name: 'Avalanche',
    symbol: 'AVAX',
    logoURI:
      'https://raw.githubusercontent.com/sonarwatch/token-registry/main/img/common/AVAX.webp',
    networkId: NetworkId.avalanche,
  },
  {
    address: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
    decimals: 18,
    name: 'Wrapped AVAX',
    symbol: 'WAVAX',
    logoURI:
      'https://raw.githubusercontent.com/sonarwatch/token-registry/main/img/common/AVAX.webp',
    networkId: NetworkId.avalanche,
  },
  {
    address: '0x0000000000000000000000000000000000000000',
    decimals: 18,
    name: 'BNB',
    symbol: 'BNB',
    logoURI:
      'https://raw.githubusercontent.com/sonarwatch/token-registry/main/img/common/BNB.webp',
    networkId: NetworkId.bnb,
  },
  {
    address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    name: 'Wrapped BNB',
    symbol: 'WBNB',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/sonarwatch/token-registry/main/img/common/BNB.webp',
    networkId: NetworkId.bnb,
  },
];
