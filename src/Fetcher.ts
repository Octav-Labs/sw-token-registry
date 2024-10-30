import { UniTokenInfo } from '@sonarwatch/portfolio-core';

export default abstract class Fetcher {
  abstract fetch(address: string): Promise<UniTokenInfo | null>;
}
