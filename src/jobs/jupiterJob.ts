import axios from 'axios';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Token, JobFct, Job } from '../types';
import { constTokensMap } from '../tokens/constTokens';
import { getKey } from '../helpers/getKey';

async function getJupTokens() {
  const res = await axios.get('https://tokens.jup.ag/tokens', {
    timeout: 240000,
  });
  if (!res || !res.data || !Array.isArray(res.data))
    throw new Error('Failed to fetch jup tokens');
  return res.data;
}

const jobFct: JobFct = async () => {
  const jupTokens = await getJupTokens();
  const tokens = new Map<string, Token>();
  for (let i = 0; i < jupTokens.length; i += 1) {
    const jupToken = jupTokens[i];

    if (constTokensMap.has(getKey(jupToken.address, NetworkId.solana)))
      continue;

    tokens.set(jupToken.address, {
      address: jupToken.address,
      chainId: 101,
      decimals: jupToken.decimals,
      name: jupToken.name,
      symbol: jupToken.symbol,
      logoURI: jupToken.logoURI || undefined,
      networkId: NetworkId.solana,
      sourceId: 'job-jupiter',
    });
  }
  return Array.from(tokens.values());
};

const jupiterJob: Job = {
  id: 'jupiter',
  jobFct,
  tags: ['jupiter', 'solana'],
};
export default jupiterJob;
