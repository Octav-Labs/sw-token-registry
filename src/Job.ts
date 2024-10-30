import { Token } from './types';

export type Job = () => Promise<Token[]>;
