import { NetworkId } from '@sonarwatch/portfolio-core';
import { getCoingeckoJob, jupiterJob } from '../jobs';
import { Job } from '../types';

export function getDefaultJobs(): Job[] {
  return [
    getCoingeckoJob(NetworkId.ethereum),
    getCoingeckoJob(NetworkId.bnb),
    getCoingeckoJob(NetworkId.polygon),
    getCoingeckoJob(NetworkId.avalanche),
    getCoingeckoJob(NetworkId.aptos),
    getCoingeckoJob(NetworkId.sui),
    jupiterJob,
  ];
}
