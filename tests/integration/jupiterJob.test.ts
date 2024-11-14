import jupiterJob from '../../src/jobs/jupiterJob';

describe('jupiterJob', () => {
  jest.setTimeout(200000); // Increase the timeout to handle potential network delays

  it('should fetch and return more than 50,000 tokens', async () => {
    const result = await jupiterJob();

    // Check that the result is an array and has more than 50,000 items
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(50000);
  });
});
