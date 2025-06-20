import axios, { AxiosResponse } from 'axios';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { RawToken } from '../types';

type JupRes = {
  result: JupToken[];
};

type JupToken = {
  id: string;
  name: string;
  symbol: string;
  icon?: string;
  decimals: number;
  tokenProgram: string;
  tags?: string[];
};

export const datapiUrl = 'https://datapi.jup.ag';

export async function fetchJupToken(
  mint: string,
  headers?: {
    [key: string]: string;
  }
): Promise<RawToken | null> {
  const res: AxiosResponse<JupRes> | null = await axios
    .get(`${datapiUrl}/v1/assets/search`, {
      params: {
        query: mint,
      },
      timeout: 10000,
      headers,
    })
    .catch(() => null);

  if (!res || !res.data) return null;
  if (!Array.isArray(res.data.result) || res.data.result.length !== 1)
    return null;

  const jupToken = res.data.result[0];
  const token: RawToken = {
    address: jupToken.id,
    chainId: 101,
    decimals: jupToken.decimals,
    name: jupToken.name,
    symbol: jupToken.symbol,
    logoURI: jupToken.icon ? jupToken.icon : undefined,
    networkId: NetworkId.solana,
    tags: jupToken.tags,
  };
  return token;
}
