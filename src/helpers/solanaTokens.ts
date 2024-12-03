import {
  NetworkId,
  uniformSolanaTokenAddress,
} from '@sonarwatch/portfolio-core';
import { Token } from '../types';

export const solanaTokens: Omit<Token, 'chainId' | 'networkId'>[] = [
  {
    address: 'xAURp5XmAG7772mfkSy6vRAjGK9JofYjc3dmQDWdVDP',
    decimals: 9,
    name: 'Aurory',
    symbol: 'xAURY',
    logoURI:
      'https://raw.githubusercontent.com/sonarwatch/token-registry/main/img/solana/xAURp5XmAG7772mfkSy6vRAjGK9JofYjc3dmQDWdVDP.webp',
  },
];

export const solanaTokensMap = new Map(
  solanaTokens.map((t): [string, Token] => [
    uniformSolanaTokenAddress(t.address),
    {
      ...t,
      chainId: 101,
      networkId: NetworkId.solana,
    },
  ])
);
