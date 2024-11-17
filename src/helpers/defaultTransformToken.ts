import { uniformTokenAddress } from '@sonarwatch/portfolio-core';
import { Token } from '../types';

export async function defaultTransformToken(token: Token): Promise<Token> {
  const name = token.name
    .normalize('NFKC')
    .replaceAll('\\', '')
    .replaceAll('\t', '')
    .replaceAll('\n', '')
    .replaceAll('\r', '')
    .replace(/[\uFE70-\uFEFF]/g, '')
    .replace(/[\uFFF0-\uFFFF]/g, '')
    .trim()
    .substring(0, 64);

  const symbol = token.symbol
    .replace(/[^\x20-\x7F]/g, '')
    .trim()
    .replaceAll(' ', '')
    .substring(0, 20);

  const nToken: Token = {
    ...token,
    symbol,
    name,
    address: uniformTokenAddress(token.address, token.networkId),
  };

  return nToken;
}
