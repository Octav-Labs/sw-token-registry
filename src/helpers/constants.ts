import {
  aptosNetwork,
  NetworkId,
  solanaNativeDecimals,
  solanaNetwork,
  suiNetwork,
  uniformEvmTokenAddress,
  uniformMoveTokenAddress,
} from '@sonarwatch/portfolio-core';
import { Token } from '../types';
import { TokenRegistry } from '../TokenRegistry';

export const solToken: Token = {
  address: '11111111111111111111111111111111',
  chainId: solanaNetwork.chainId,
  decimals: solanaNativeDecimals,
  name: 'Solana',
  networkId: NetworkId.solana,
  symbol: 'SOL',
  logoURI:
    'https://raw.githubusercontent.com/sonarwatch/token-registry/main/img/common/SOL.webp',
};

export const wsolToken: Token = {
  address: 'So11111111111111111111111111111111111111112',
  chainId: solanaNetwork.chainId,
  decimals: solanaNativeDecimals,
  name: 'Wrapped SOL',
  networkId: NetworkId.solana,
  symbol: 'wSOL',
  logoURI:
    'https://raw.githubusercontent.com/sonarwatch/token-registry/main/img/common/SOL.webp',
};

export const suiToken: Token = {
  address: uniformMoveTokenAddress(
    '0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI'
  ),
  chainId: suiNetwork.chainId,
  decimals: suiNetwork.native.decimals,
  name: 'Sui',
  networkId: NetworkId.sui,
  symbol: 'SUI',
  logoURI:
    'https://raw.githubusercontent.com/sonarwatch/token-registry/main/img/common/SUI.webp',
};

export const aptosToken: Token = {
  address: uniformMoveTokenAddress('0x1::aptos_coin::AptosCoin'),
  chainId: aptosNetwork.chainId,
  decimals: aptosNetwork.native.decimals,
  name: 'Aptos',
  networkId: NetworkId.aptos,
  symbol: 'APT',
  logoURI:
    'https://raw.githubusercontent.com/sonarwatch/token-registry/main/img/common/APT.webp',
};

export const rawTokens: Token[] = [
  {
    chainId: 1,
    address: uniformEvmTokenAddress(
      '0x0000000000000000000000000000000000000000'
    ),
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
    logoURI:
      'https://raw.githubusercontent.com/sonarwatch/token-registry/main/img/common/ETH.webp',
    networkId: NetworkId.ethereum,
  },
  {
    chainId: 1,
    address: uniformEvmTokenAddress(
      '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
    ),
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
    logoURI:
      'https://raw.githubusercontent.com/sonarwatch/token-registry/main/img/common/ETH.webp',
    networkId: NetworkId.ethereum,
  },
  {
    name: 'Polygon Ecosystem Token',
    address: uniformEvmTokenAddress(
      '0x0000000000000000000000000000000000001010'
    ),
    symbol: 'POL',
    decimals: 18,
    chainId: 137,
    logoURI:
      'https://raw.githubusercontent.com/sonarwatch/token-registry/main/img/common/MATIC.webp',
    networkId: NetworkId.polygon,
  },
  {
    name: 'Wrapped Polygon Ecosystem Token',
    address: uniformEvmTokenAddress(
      '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270'
    ),
    symbol: 'WPOL',
    decimals: 18,
    chainId: 137,
    logoURI:
      'https://raw.githubusercontent.com/sonarwatch/token-registry/main/img/common/MATIC.webp',
    networkId: NetworkId.polygon,
  },
  {
    chainId: 43114,
    address: uniformEvmTokenAddress(
      '0x0000000000000000000000000000000000000000'
    ),
    decimals: 18,
    name: 'Avalanche',
    symbol: 'AVAX',
    logoURI:
      'https://raw.githubusercontent.com/sonarwatch/token-registry/main/img/common/AVAX.webp',
    networkId: NetworkId.avalanche,
  },
  {
    chainId: 43114,
    address: uniformEvmTokenAddress(
      '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7'
    ),
    decimals: 18,
    name: 'Wrapped AVAX',
    symbol: 'WAVAX',
    logoURI:
      'https://raw.githubusercontent.com/sonarwatch/token-registry/main/img/common/AVAX.webp',
    networkId: NetworkId.avalanche,
  },
  {
    chainId: 56,
    address: uniformEvmTokenAddress(
      '0x0000000000000000000000000000000000000000'
    ),
    decimals: 18,
    name: 'BNB',
    symbol: 'BNB',
    logoURI:
      'https://raw.githubusercontent.com/sonarwatch/token-registry/main/img/common/BNB.webp',
    networkId: NetworkId.bnb,
  },
  {
    chainId: 56,
    address: uniformEvmTokenAddress(
      '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c'
    ),
    name: 'Wrapped BNB',
    symbol: 'WBNB',
    decimals: 18,
    logoURI:
      'https://raw.githubusercontent.com/sonarwatch/token-registry/main/img/common/BNB.webp',
    networkId: NetworkId.bnb,
  },
  suiToken,
  aptosToken,
];

export const rawTokensMap = new Map(
  rawTokens.map((t) => [TokenRegistry.getKey(t.address, t.networkId), t])
);
