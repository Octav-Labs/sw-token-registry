import { NetworkIdType, UniTokenInfo } from '@sonarwatch/portfolio-core';

export type Token = UniTokenInfo & {
  networkId: NetworkIdType;
};

export type JobFct = () => Promise<Token[]>;

export type Job = {
  jobFct: JobFct;
  id: string;
  tags: string[];
};

export type Milliseconds = number;
export type Seconds = number;
