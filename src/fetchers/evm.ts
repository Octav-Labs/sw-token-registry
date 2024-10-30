import { UniTokenInfo } from '@sonarwatch/portfolio-core';
import axios from 'axios';
import Fetcher from '../Fetcher';

export default class EvmFetcher extends Fetcher {
  private rpc: string;

  constructor(rpc: string) {
    super();
    this.rpc = rpc;
  }

  async fetch(address: string): Promise<UniTokenInfo | null> {
    const res = await axios.post(this.rpc, {
      jsonrpc: '2.0',
      id: 'text',
      method: 'getAsset',
      params: { id: address },
    });
    return res.data;
  }
}
