import axios from 'axios';
import { NetworkId } from '@sonarwatch/portfolio-core';
import SolanaFetcher from '../../src/fetchers/solana';
import { Token } from '../../src/types';

// Mock the axios module
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SolanaFetcher', () => {
  const dasUrl = 'https://example.com';
  let fetcher: SolanaFetcher;

  beforeEach(() => {
    fetcher = new SolanaFetcher(dasUrl);
  });

  it('should call the correct URL and return data when fetch is called', async () => {
    const address = 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3';
    const mockResponse = {
      result: {
        id: 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3',
        content: {
          json_uri:
            'https://arweave.net/GWKBRfaCBSiDWs0hYHe_PCEEhKoq_Bl3JlpmW5MqRnE',
          files: [
            {
              uri: 'https://pyth.network/token.svg',
            },
          ],
          metadata: {
            description: 'Governance Token for the Pyth Network oracle.',
            name: 'Pyth Network',
            symbol: 'PYTH',
            token_standard: 'Fungible',
          },
          links: { image: 'https://pyth.network/token.svg' },
        },
        token_info: {
          symbol: 'PYTH',
          decimals: 6,
        },
      },
    };

    // Mocking axios.post to return a resolved promise with mock data
    mockedAxios.post.mockResolvedValueOnce({ data: mockResponse });

    // Call the fetch method
    const result = await fetcher.fetch(address);

    // Check if axios.post was called with correct parameters
    expect(mockedAxios.post).toHaveBeenCalledWith(dasUrl, {
      jsonrpc: '2.0',
      id: 'text',
      method: 'getAsset',
      params: { id: address },
    });

    // Check if the fetch method returned the expected data
    const pythToken: Token = {
      address: 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3',
      chainId: 101,
      decimals: 6,
      name: 'Pyth Network',
      symbol: 'PYTH',
      logoURI: 'https://pyth.network/token.svg',
      networkId: NetworkId.solana,
      sourceId: fetcher.getSourceId(),
    };
    expect(result).toEqual(pythToken);
  });

  it('should throw an error if axios.post fails', async () => {
    const address = 'sampLe1111111111111111111111111111111111111';
    mockedAxios.post.mockRejectedValueOnce(new Error('Network error'));
    await expect(fetcher.fetch(address)).rejects.toThrow('Network error');
  });
});
