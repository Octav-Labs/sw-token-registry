import {
  NetworkId,
  uniformSolanaTokenAddress,
} from '@sonarwatch/portfolio-core';
import { Token } from '../types';

export const solanaTokens: Omit<Token, 'chainId' | 'networkId' | 'logoURI'>[] =
  [
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
  ];

export const solanaTokensMap = new Map(
  solanaTokens.map((t): [string, Token] => [
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
