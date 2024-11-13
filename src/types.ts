import { NetworkIdType, UniTokenInfo } from '@sonarwatch/portfolio-core';

export type Token = UniTokenInfo & {
  networkId: NetworkIdType;
};
