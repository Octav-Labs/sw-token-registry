import axios, { AxiosResponse } from 'axios';
import { sleep } from './misc';

type GeckoCoin = {
  id?: string;
  symbol?: string;
  name?: string;
  platforms?: { [key: string]: string };
};

const COINS_LIST_TTL = 93600000; // 26h
let gCoinsList: GeckoCoin[] | undefined;
let gCoinsListTs = 0;

export async function getCoingeckoCoinsList() {
  if (gCoinsList && Date.now() - COINS_LIST_TTL < gCoinsListTs)
    return gCoinsList;

  await sleep(600000);
  const coinsListRes: AxiosResponse<GeckoCoin[]> | null = await axios
    .get('https://api.coingecko.com/api/v3/coins/list', {
      params: {
        include_platform: 'true',
      },
      timeout: 120000,
    })
    .catch((e) => {
      if (e?.response?.status === 429) return null;
      throw new Error(e);
    });
  if (coinsListRes?.data) {
    gCoinsList = coinsListRes.data;
    gCoinsListTs = Date.now();
  }
  if (!gCoinsList) throw new Error("Can't getCoingeckoCoinsList");

  return gCoinsList;
}
