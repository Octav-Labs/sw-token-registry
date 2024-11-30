import axios from 'axios';
import { NetworkId } from '@sonarwatch/portfolio-core';
import jupiterJob from '../../src/jobs/jupiterJob';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('jupiterJob', () => {
  it('should fetch and transform tokens correctly', async () => {
    // Mock response data
    const mockResponseData = [
      {
        address: 'token1',
        decimals: 6,
        name: 'Token One',
        symbol: 'TKN1',
        logoURI: 'https://example.com/token1.png',
      },
      {
        address: 'token2',
        decimals: 8,
        name: 'Token Two',
        symbol: 'TKN2',
        logoURI: 'https://example.com/token2.png',
      },
    ];

    // Set the axios mock to return the mocked data
    mockedAxios.get.mockResolvedValue({ data: mockResponseData });

    // Call the job function
    const result = await jupiterJob.jobFct();

    // Expected output array
    const expectedResult = [
      {
        address: 'token1',
        chainId: 101,
        decimals: 6,
        name: 'Token One',
        symbol: 'TKN1',
        logoURI: 'https://example.com/token1.png',
        networkId: NetworkId.solana,
      },
      {
        address: 'token2',
        chainId: 101,
        decimals: 8,
        name: 'Token Two',
        symbol: 'TKN2',
        logoURI: 'https://example.com/token2.png',
        networkId: NetworkId.solana,
      },
    ];

    expect(result).toEqual(expectedResult);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://tokens.jup.ag/tokens',
      {
        timeout: 240000,
      }
    );
  });

  it('should throw an error if the response is not valid', async () => {
    // Mock response with invalid data
    mockedAxios.get.mockResolvedValue({ data: null });

    // Expect the function to throw an error
    await expect(jupiterJob.jobFct()).rejects.toThrow(
      'Failed to fetch jup tokens'
    );

    // Ensure axios was called correctly
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://tokens.jup.ag/tokens',
      {
        timeout: 240000,
      }
    );
  });

  it('should throw an error if axios fails', async () => {
    // Mock axios to throw an error
    mockedAxios.get.mockRejectedValue(new Error('Network error'));

    // Expect the function to throw an error
    await expect(jupiterJob.jobFct()).rejects.toThrow('Network error');

    // Ensure axios was called correctly
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://tokens.jup.ag/tokens',
      {
        timeout: 240000,
      }
    );
  });
});
