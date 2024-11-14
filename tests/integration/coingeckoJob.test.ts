import { NetworkId } from '@sonarwatch/portfolio-core';
import getCoingeckoJob from '../../src/jobs/coingeckoJob';

describe('coingeckoJob', () => {
  jest.setTimeout(800000); // Increase the timeout to handle potential network delays

  it('should fetch and return more than 20 tokens', async () => {
    const coingeckoJobSui = getCoingeckoJob(NetworkId.sui);
    const result = await coingeckoJobSui();

    // Check that the result is an array and has more than 20 items
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(20);

    // eslint-disable-next-line no-console
    console.log(`Total tokens fetched: ${result.length}`);
  });
});
