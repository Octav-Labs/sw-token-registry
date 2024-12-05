import { NetworkId } from '@sonarwatch/portfolio-core';
import getCoingeckoJob from '../../src/jobs/coingeckoJob';

describe('coingeckoJob', () => {
  jest.setTimeout(800000); // Increase the timeout to handle potential network delays

  it('should fetch and return more than 20 tokens', async () => {
    const coingeckoJob = getCoingeckoJob(NetworkId.aptos);
    const result = await coingeckoJob.jobFct();

    // Check that the result is an array and has more than 20 items
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(20);
  });
});
