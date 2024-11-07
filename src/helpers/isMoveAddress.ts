import { hexDataLength, isHexString } from '@ethersproject/bytes';

export function isMoveAddress(address: string): boolean {
  let fAddress = address.toLowerCase();
  if (!fAddress.startsWith('0x')) {
    fAddress = `0x${fAddress}`;
  }
  if ((address.length - 2) % 2 !== 0) {
    fAddress = `0x0${fAddress.slice(2)}`;
  }

  const isHex = isHexString(fAddress);
  const hexLength = hexDataLength(fAddress);
  if (!isHex || !hexLength || hexLength > 32) return false;

  return true;
}
