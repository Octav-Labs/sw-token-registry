import { Token } from './types';

export default abstract class Fetcher {
  abstract fetch(address: string): Promise<Token | null>;
}
