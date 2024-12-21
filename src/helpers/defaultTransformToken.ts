import { uniformTokenAddress } from '@sonarwatch/portfolio-core';
import { Token } from '../types';
import { isUri } from './isUri';

function isLowerCase(str: string): boolean {
  return str === str.toLowerCase();
}

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

  let symbol = token.symbol
    .replace(/[^\x20-\x7F]/g, '')
    .trim()
    .replaceAll(' ', '')
    .substring(0, 20);

  if (isLowerCase(symbol)) symbol = symbol.toUpperCase();

  const nToken: Token = {
    ...token,
    symbol,
    name,
    address: uniformTokenAddress(token.address, token.networkId),
    logoURI: isUri(token.logoURI) ? token.logoURI : undefined,
  };

  return nToken;
}
