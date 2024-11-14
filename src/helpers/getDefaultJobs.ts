import { NetworkId } from '@sonarwatch/portfolio-core';
import { getCoingeckoJob, jupiterJob } from '../jobs';
import { Job } from '../Job';

export function getDefaultJobs(): Job[] {
  return [
    getCoingeckoJob(NetworkId.ethereum),
    getCoingeckoJob(NetworkId.aptos),
    getCoingeckoJob(NetworkId.sui),
    jupiterJob,
  ];
}
