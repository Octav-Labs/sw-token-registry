import { Token } from './types';

export default abstract class Fetcher {
  fetch(address: string): Promise<Token | null> {
    const uAddress = this.uniformTokenAddress(address);
    return this._fetch(uAddress);
  }
  protected abstract _fetch(address: string): Promise<Token | null>;
  protected abstract uniformTokenAddress(address: string): string;
}
