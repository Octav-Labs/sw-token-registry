import { RawToken, Token } from './types';

export default abstract class Fetcher {
  abstract readonly id: string;
  public getSourceId() {
    return `fetcher-${this.id}`;
  }

  async fetch(address: string): Promise<Token | null> {
    const uAddress = this.uniformTokenAddress(address);
    const rToken = await this._fetch(uAddress);
    return rToken
      ? {
          ...rToken,
          sourceId: this.getSourceId(),
        }
      : null;
  }
  protected abstract _fetch(address: string): Promise<RawToken | null>;
  protected abstract uniformTokenAddress(address: string): string;
}
