import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import tokenSchema from '../src/tokenSchema';

describe('Token Schema Validation', () => {
  it('should validate a valid token object', async () => {
    const ajv = new Ajv();
    addFormats(ajv);
    const ajvToken = ajv.compile(tokenSchema);
    const token = {
      address: 'EJPtJEDogxzDbvM8qvAsqYbLmPj5n1vQeqoAzj9Yfv3q',
      chainId: 101,
      decimals: 9,
      name: 'bozo',
      symbol: '',
      logoURI:
        'https://nftstorage.link/ipfs/bafkreiamobqahwlwio5syavvfkknvfecgt7osbsh2s4xizihgpsajethyy',
      networkId: 'solana',
      sourceId: 'job-jupiter',
    };
    const valid = ajvToken(token);
    expect(valid).toBe(true);
  });
});
