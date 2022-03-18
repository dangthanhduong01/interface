import { Currency, CurrencyAmount } from '@uniswap/sdk-core'
import { ChainIdToCurrencyIdTo } from 'src/constants/chains'
import { CovalentWalletBalanceItem } from 'src/features/dataApi/covalentTypes'
import { CurrencyId } from 'src/utils/currencyId'

export type SpotPrices = Record<CurrencyId, number>

export type ChainIdToCurrencyIdToPortfolioBalance = ChainIdToCurrencyIdTo<PortfolioBalance>
export type PortfolioBalances = Record<CurrencyId, PortfolioBalance>
// Portfolio balance as exposed to the app
export type PortfolioBalance = {
  amount: CurrencyAmount<Currency>
  balanceUSD: number
  relativeChange24: number
}
// Portfolio balance as stored in Redux
export type SerializablePortfolioBalance = {
  balance: number
  balanceUSD: number
  relativeChange24: number
} & Pick<CovalentWalletBalanceItem, 'contract_address' | 'contract_ticker_symbol'>
