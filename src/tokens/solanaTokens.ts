import { NetworkId, solanaNativeDecimals } from '@sonarwatch/portfolio-core';
import { RawToken } from '../types';

export const solanaTokens: Omit<RawToken, 'chainId'>[] = [
  {
    address: '11111111111111111111111111111111',
    decimals: solanaNativeDecimals,
    name: 'Solana',
    networkId: NetworkId.solana,
    symbol: 'SOL',
    logoURI:
      'https://raw.githubusercontent.com/sonarwatch/token-registry/main/img/common/SOL.webp',
    tags: ['community', 'strict', 'verified'],
  },
  {
    address: 'So11111111111111111111111111111111111111112',
    decimals: solanaNativeDecimals,
    name: 'Wrapped SOL',
    networkId: NetworkId.solana,
    symbol: 'wSOL',
    logoURI:
      'https://raw.githubusercontent.com/sonarwatch/token-registry/main/img/common/SOL.webp',
    tags: ['community', 'strict', 'verified'],
  },
  {
    address: 'xAURp5XmAG7772mfkSy6vRAjGK9JofYjc3dmQDWdVDP',
    decimals: 9,
    name: 'Aurory',
    symbol: 'xAURY',
    networkId: NetworkId.solana,
  },
  {
    address: 'vPtS4ywrbEuufwPkBXsCYkeTBfpzCd6hF52p8kJGt9b',
    decimals: 6,
    name: 'Vault Points',
    symbol: 'VPTS',
    networkId: NetworkId.solana,
  },
  {
    address: 'FAJA9Qgn1CqLKtYi77CoWSGH7dyRrat394q9mpRFQzGs',
    decimals: 6,
    name: 'PayPal USD wrapped by Save',
    symbol: 'PYUSD',
    networkId: NetworkId.solana,
  },
  {
    address: '59obFNBzyTBGowrkif5uK7ojS58vsuWz3ZCvg6tfZAGw',
    decimals: 6,
    name: 'PayFi Strategy Token',
    symbol: 'PST',
    networkId: NetworkId.solana,
    tags: ['community-assist', 'verified'],
  },
  {
    address: 'WENWENvqqNya429ubCdR81ZmD69brwQaaBYY6p3LCpk',
    decimals: 5,
    name: 'Wen',
    symbol: 'WEN',
    networkId: NetworkId.solana,
    tags: ['birdeye-trending', 'community', 'strict', 'verified'],
  },
  {
    address: 'WFRGB49tP8CdKubqCdt5Spo2BdGS4BpgoinNER5TYUm',
    decimals: 8,
    name: 'Wrapped Fragmetric Staked BTC',
    symbol: 'wfragBTC',
    networkId: NetworkId.solana,
    tags: ['unknown'],
  },
];
