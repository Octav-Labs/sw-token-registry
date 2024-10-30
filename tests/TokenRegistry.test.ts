import { TokenRegistry } from '../src/TokenRegistry';
import { getDefaultFetchers } from '../src/helpers';

describe('TokenRegistry', () => {
  it('sould be instantiable', async () => {
    const s3Endpoint = process.env.S3_ENDPOINT;
    const s3AccessKeyId = process.env.S3_ACCESS_KEY_ID;
    const s3SecretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
    const s3Bucket = process.env.S3_BUCKET;
    const s3Region = process.env.S3_REGION;
    if (!s3Endpoint) return;
    if (!s3AccessKeyId) return;
    if (!s3SecretAccessKey) return;
    if (!s3Bucket) return;

    const fetchers = getDefaultFetchers({
      solana: { dasUrl: '' },
      ethereum: { rpc: '' },
    });
    const tokenRegistry = new TokenRegistry({
      fetchers,
      redisOptions: {},
      s3Config: {
        bucket: s3Bucket || '',
        endpoint: s3Endpoint,
        credentials: {
          accessKeyId: s3AccessKeyId || '',
          secretAccessKey: s3SecretAccessKey || '',
        },
        forcePathStyle: true,
        region: s3Region,
      },
      jobs: [],
    });
    await tokenRegistry.checkS3Client();
    expect(tokenRegistry).toBeDefined();
  });
});
