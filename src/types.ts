import { NetworkIdType, UniTokenInfo } from '@sonarwatch/portfolio-core';

export type Token = UniTokenInfo & {
  networkId: NetworkIdType;
};

export type Job = () => Promise<Token[]>;

export type Milliseconds = number;
export type Seconds = number;
