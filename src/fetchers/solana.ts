import { UniTokenInfo } from '@sonarwatch/portfolio-core';
import axios from 'axios';
import Fetcher from '../Fetcher';

export default class SolanaFetcher extends Fetcher {
  private dasUrl: string;

  constructor(dasUrl: string) {
    super();
    this.dasUrl = dasUrl;
  }

  async fetch(address: string): Promise<UniTokenInfo | null> {
    const res = await axios.post(this.dasUrl, {
      jsonrpc: '2.0',
      id: 'text',
      method: 'getAsset',
      params: { id: address },
    });
    return res.data;
  }
}
