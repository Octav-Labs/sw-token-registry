import { NetworkIdType, uniformTokenAddress } from '@sonarwatch/portfolio-core';

export function getKey(address: string, networkId: NetworkIdType) {
  const uniTokAddress = uniformTokenAddress(address, networkId);
  return `token:${networkId}:${uniTokAddress}`;
}
