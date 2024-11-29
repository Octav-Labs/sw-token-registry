import {
  getNetworkById,
  isTokenAddressValid,
  NetworkIdType,
  uniformTokenAddress,
} from '@sonarwatch/portfolio-core';
import axios, { AxiosResponse } from 'axios';
import { sleep } from '../helpers/misc';
import { Token, Job } from '../types';
import { evmTokensMap } from '../helpers/constants';
import { TokenRegistry } from '../TokenRegistry';

const platforms: Record<string, string> = {
  aptos: 'aptos',
  avalanche: 'avalanche',
  bnb: 'binance-smart-chain',
  arbitrum: 'arbitrum-one',
  base: 'base',
  cronos: 'cronos',
  gnosis: 'xdai',
  linea: 'linea',
  scroll: 'scroll',
  zksync: 'zksync',
  'polygon-zkevm': 'polygon-zkevm',
  ethereum: 'ethereum',
  optimism: 'optimistic-ethereum',
  polygon: 'polygon-pos',
  solana: 'solana',
  sui: 'sui',
  sei: 'sei',
};

type GeckoCoin = {
  id?: string;
  symbol?: string;
  name?: string;
  platforms?: { [key: string]: string };
};

type GeckoCoinDetails = {
  id?: string;
  symbol?: string;
  name?: string;
  detail_platforms?: {
    [key: string]: {
      decimal_place?: number;
      contract_address?: string;
    };
  };
  image?: {
    thumb: string;
    small: string;
    large: string;
  };
};

async function getCoingeckoCoinsList() {
  if (process.env.NODE_ENV !== 'test') await sleep(240000);
  const coinsListRes: AxiosResponse<GeckoCoin[]> = await axios.get(
    'https://api.coingecko.com/api/v3/coins/list',
    {
      params: {
        include_platform: 'true',
      },
      timeout: 60000,
    }
  );
  if (process.env.NODE_ENV !== 'test') await sleep(180000);
  return coinsListRes.data;
}

function coingeckoPlatformFromNetworkId(networkId: NetworkIdType) {
  const platform = platforms[networkId];
  if (!platform) throw new Error('Platform is missing');
  return platform;
}

function getCoingeckoJob(networkId: NetworkIdType) {
  const gPlatform = coingeckoPlatformFromNetworkId(networkId);
  const network = getNetworkById(networkId);
  const { chainId } = network;

  const coingeckoJob: Job = async () => {
    const coinsList = await getCoingeckoCoinsList();

    const tokens: Map<string, Token> = new Map();
    for (let i = 0; i < coinsList.length; i += 1) {
      const gCoin = coinsList[i];
      if (!gCoin.id || !gCoin.name || !gCoin.platforms || !gCoin.symbol)
        continue;
      if (!gCoin.platforms[gPlatform]) continue;

      const isTokAddValid = isTokenAddressValid(
        gCoin.platforms[gPlatform],
        networkId
      );
      if (!isTokAddValid) continue;
      const address = uniformTokenAddress(
        gCoin.platforms[gPlatform],
        networkId
      );

      // Ignore tokens that are in evmTokensMap
      if (evmTokensMap.has(TokenRegistry.getKey(address, networkId))) continue;

      const coinDetailsRes: AxiosResponse<GeckoCoinDetails> | null = await axios
        .get(`https://api.coingecko.com/api/v3/coins/${gCoin.id}`, {
          params: {
            localization: false,
            tickers: false,
            market_data: false,
            sparkline: false,
          },
        })
        .catch(() => null);
      await sleep(5000);
      if (!coinDetailsRes) continue;
      const coinDetails = coinDetailsRes.data;
      if (!coinDetails.name || !coinDetails.symbol) continue;
      const decimals = coinDetails.detail_platforms?.[gPlatform]?.decimal_place;
      if (decimals === undefined) continue;

      const token: Token = {
        address,
        decimals,
        chainId,
        name: coinDetails.name,
        networkId,
        symbol: coinDetails.symbol,
        logoURI: coinDetails.image?.small,
      };
      tokens.set(token.address, token);
    }
    return Array.from(tokens.values());
  };
  return coingeckoJob;
}

export default getCoingeckoJob;
