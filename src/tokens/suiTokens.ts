import { NetworkId, suiNetwork } from '@sonarwatch/portfolio-core';
import { RawToken } from '../types';

export const suiTokens: Omit<RawToken, 'chainId'>[] = [
  {
    address:
      '0x0000000000000000000000000000000000000000000000000000000000000002::sui::SUI',
    decimals: suiNetwork.native.decimals,
    name: 'Sui',
    networkId: NetworkId.sui,
    symbol: 'SUI',
    logoURI:
      'https://raw.githubusercontent.com/sonarwatch/token-registry/main/img/common/SUI.webp',
  },
  {
    address:
      '0xb231fcda8bbddb31f2ef02e6161444aec64a514e2c89279584ac9806ce9cf037::coin::COIN',
    decimals: 6,
    name: 'USD Coin (Wormhole from Solana)',
    symbol: 'USDCso',
    logoURI:
      'https://raw.githubusercontent.com/sonarwatch/token-registry/main/img/common/USDC.webp',
    networkId: NetworkId.sui,
  },
  {
    address:
      '0x909cba62ce96d54de25bec9502de5ca7b4f28901747bbf96b76c2e63ec5f1cba::coin::COIN',
    decimals: 8,
    name: 'USD Coin (BNB)',
    symbol: 'USDCbnb',
    logoURI:
      'https://raw.githubusercontent.com/sonarwatch/token-registry/main/img/common/USDC.webp',
    networkId: NetworkId.sui,
  },
  {
    address:
      '0xe32d3ebafa42e6011b87ef1087bbc6053b499bf6f095807b9013aff5a6ecd7bb::coin::COIN',
    decimals: 6,
    name: 'USD Coin (ARB)',
    symbol: 'USDCarb',
    logoURI:
      'https://raw.githubusercontent.com/sonarwatch/token-registry/main/img/common/USDC.webp',
    networkId: NetworkId.sui,
  },
];
