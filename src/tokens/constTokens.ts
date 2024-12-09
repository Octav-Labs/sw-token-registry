import {
  getNetworkById,
  uniformAddressByNetworkId,
} from '@sonarwatch/portfolio-core';
import { RawToken } from '../types';
import { solanaTokens } from './solanaTokens';
import { suiTokens } from './suiTokens';
import { aptosTokens } from './aptosTokens';
import { evmTokens } from './evmTokens';
import { getKey } from '../helpers/getKey';

export const constTokens: Omit<RawToken, 'chainId'>[] = [
  ...solanaTokens,
  ...suiTokens,
  ...aptosTokens,
  ...evmTokens,
];

export const constTokensMap: Map<string, RawToken> = new Map(
  constTokens.map((t): [string, RawToken] => [
    getKey(t.address, t.networkId),
    {
      ...t,
      address: uniformAddressByNetworkId(t.address, t.networkId),
      chainId: getNetworkById(t.networkId).chainId,
      logoURI:
        t.logoURI ||
        `https://raw.githubusercontent.com/sonarwatch/token-registry/main/img/${t.networkId}/${t.address}.webp`,
    },
  ])
);
