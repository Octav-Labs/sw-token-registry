import axios from 'axios';
import { NetworkId } from '@sonarwatch/portfolio-core';
import { Token, JobFct, Job } from '../types';
import { solToken, wsolToken } from '../helpers/constants';
import { solanaTokensMap } from '../helpers/solanaTokens';

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
    if (jupToken.address === solToken.address) continue;
    if (jupToken.address === wsolToken.address) continue;
    if (solanaTokensMap.has(jupToken.address)) continue;

    tokens.set(jupToken.address, {
      address: jupToken.address,
      chainId: 101,
      decimals: jupToken.decimals,
      name: jupToken.name,
      symbol: jupToken.symbol,
      logoURI: jupToken.logoURI,
      networkId: NetworkId.solana,
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
