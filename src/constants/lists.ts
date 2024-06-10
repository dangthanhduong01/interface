export const UNI_LIST = 'https://gateway.ipfs.io/ipns/tokens.uniswap.org'
export const UNI_EXTENDED_LIST = 'https://gateway.ipfs.io/ipns/extendedtokens.uniswap.org'
const UNI_UNSUPPORTED_LIST = 'https://gateway.ipfs.io/ipns/unsupportedtokens.uniswap.org'
const AAVE_LIST = 'tokenlist.aave.eth'
const BA_LIST = 'https://raw.githubusercontent.com/The-Blockchain-Association/sec-notice-list/master/ba-sec-list.json'
const CMC_ALL_LIST = 'https://s3.coinmarketcap.com/generated/dex/tokens/eth-tokens-all.json'
const COINGECKO_LIST = 'https://tokens.coingecko.com/uniswap/all.json'
const COINGECKO_BNB_LIST = 'https://tokens.coingecko.com/binance-smart-chain/all.json'
const COMPOUND_LIST = 'https://raw.githubusercontent.com/compound-finance/token-list/master/compound.tokenlist.json'
const GEMINI_LIST = 'https://www.gemini.com/uniswap/manifest.json'
const KLEROS_LIST = 't2crtokens.eth'
const SET_LIST = 'https://raw.githubusercontent.com/SetProtocol/uniswap-tokenlist/main/set.tokenlist.json'
const WRAPPED_LIST = 'wrapped.tokensoft.eth'

export const OPTIMISM_LIST = 'https://static.optimism.io/optimism.tokenlist.json'
export const ARBITRUM_LIST = 'https://bridge.arbitrum.io/token-list-42161.json'
export const CELO_LIST = 'https://celo-org.github.io/celo-token-list/celo.tokenlist.json'
export const PLASMA_BNB_LIST = 'https://raw.githubusercontent.com/plasmadlt/plasma-finance-token-list/master/bnb.json'

export const UNSUPPORTED_LIST_URLS: string[] = [BA_LIST, UNI_UNSUPPORTED_LIST]
type Token = {
  chainId: number;
  name: string;
  address: string;
  decimals: number;
  symbol: string;
  logoURI: string;
};

type Version = {
  major: number;
  minor: number;
  patch: number;
};

type TokenList = {
  name: string;
  logoURI: string;
  keywords: string[];
  timestamp: string;
  tokens: Token[];
  version: Version;
};
const myTokenList: TokenList = {
  "name":"TrustkeyCoin",
  "logoURI":"https://static.coingecko.com/s/thumbnail-007177f3eca19695592f0b8b0eabbdae282b54154e1be912285c9034ea6cbaf2.png",
  "keywords":["defi"],
  "timestamp":"2024-06-05T02:01:13.652+00:00",
  "tokens":[
      {
        "chainId": 11968,
        "name": "FIRSTCOIN",
        "address": "0x1ccF6A9b71c16E226C0Dff0B50EDd875375C84D0",
        "decimals": 18,
        "symbol": "FC",
        "logoURI": "https://explorer.waterfall.network/favicon-72-precomposed.png"
      },
      {
        "chainId": 11968,
        "name": "ACOIN",
        "address": "0x7fA9d0EA98de26e3497455CbA80fbEebEdF7f6E9",
        "decimals": 18,
        "symbol": "AC",
        "logoURI": "https://explorer.waterfall.network/favicon-72-precomposed.png"
      }
    ],
    "version":{
      "major":41,
      "minor":0,
      "patch":58
  }
}
export const TRUSTKEY_LIST = JSON.stringify(myTokenList)
// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = [UNI_LIST]
export const DEFAULT_INACTIVE_LIST_URLS: string[] = [
  UNI_EXTENDED_LIST,
  COMPOUND_LIST,
  AAVE_LIST,
  CMC_ALL_LIST,
  COINGECKO_LIST,
  COINGECKO_BNB_LIST,
  KLEROS_LIST,
  GEMINI_LIST,
  WRAPPED_LIST,
  SET_LIST,
  ARBITRUM_LIST,
  OPTIMISM_LIST,
  CELO_LIST,
  PLASMA_BNB_LIST,
  TRUSTKEY_LIST,
  ...UNSUPPORTED_LIST_URLS,
]

export const DEFAULT_LIST_OF_LISTS: string[] = [...DEFAULT_ACTIVE_LIST_URLS, ...DEFAULT_INACTIVE_LIST_URLS]
