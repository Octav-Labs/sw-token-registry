import axios, { AxiosResponse } from 'axios';
import { sleep } from './misc';

type GeckoCoin = {
  id?: string;
  symbol?: string;
  name?: string;
  platforms?: { [key: string]: string };
};

const COINS_LIST_TTL = 21600000; // 6h
let gCoinsList: GeckoCoin[] | undefined;
let gCoinsListTs = 0;

export async function getCoingeckoCoinsList() {
  await sleep(300000);

  if (gCoinsList && Date.now() - COINS_LIST_TTL < gCoinsListTs)
    return gCoinsList;

  await sleep(600000);
  const coinsListRes: AxiosResponse<GeckoCoin[]> = await axios.get(
    'https://api.coingecko.com/api/v3/coins/list',
    {
      params: {
        include_platform: 'true',
      },
      timeout: 120000,
    }
  );
  gCoinsList = coinsListRes.data;
  gCoinsListTs = Date.now();
  return gCoinsList;
}
