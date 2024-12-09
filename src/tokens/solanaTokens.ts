import {
  NetworkId,
  uniformSolanaTokenAddress,
} from '@sonarwatch/portfolio-core';
import { RawToken } from '../types';

export const solanaTokens: Omit<
  RawToken,
  'chainId' | 'networkId' | 'logoURI'
>[] = [
  {
    address: 'xAURp5XmAG7772mfkSy6vRAjGK9JofYjc3dmQDWdVDP',
    decimals: 9,
    name: 'Aurory',
    symbol: 'xAURY',
  },
  {
    address: 'vPtS4ywrbEuufwPkBXsCYkeTBfpzCd6hF52p8kJGt9b',
    decimals: 6,
    name: 'Vault Points',
    symbol: 'VPTS',
  },
  {
    address: 'FAJA9Qgn1CqLKtYi77CoWSGH7dyRrat394q9mpRFQzGs',
    decimals: 6,
    name: 'PayPal USD wrapped by Save',
    symbol: 'PYUSD',
  },
];

export const solanaTokensMap = new Map(
  solanaTokens.map((t): [string, RawToken] => [
    uniformSolanaTokenAddress(t.address),
    {
      ...t,
      address: uniformSolanaTokenAddress(t.address),
      chainId: 101,
      networkId: NetworkId.solana,
      logoURI: `https://raw.githubusercontent.com/sonarwatch/token-registry/main/img/solana/${t.address}.webp`,
    },
  ])
);
