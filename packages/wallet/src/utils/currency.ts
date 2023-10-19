import { Currency } from '@uniswap/sdk-core'
import { FiatNumberType, formatCurrencyAmount, formatFiatNumber } from 'utilities/src/format/format'
import { PollingInterval } from 'wallet/src/constants/misc'
import {
  Currency as ServerCurrency,
  useConvertQuery,
} from 'wallet/src/data/__generated__/types-and-hooks'
import { FEATURE_FLAGS } from 'wallet/src/features/experiments/constants'
import { useFeatureFlag } from 'wallet/src/features/experiments/hooks'
import { getValidAddress, shortenAddress } from 'wallet/src/utils/addresses'
import { getCurrencyAmount, ValueType } from 'wallet/src/utils/getCurrencyAmount'

export function getFormattedCurrencyAmount(
  currency: Maybe<Currency>,
  currencyAmountRaw: string,
  isApproximateAmount = false
): string {
  const currencyAmount = getCurrencyAmount({
    value: currencyAmountRaw,
    valueType: ValueType.Raw,
    currency,
  })

  if (!currencyAmount) return ''

  const formattedAmount = formatCurrencyAmount(currencyAmount)
  return isApproximateAmount ? `~${formattedAmount} ` : `${formattedAmount} `
}

export function getCurrencyDisplayText(
  currency: Maybe<Currency>,
  tokenAddressString: Address | undefined
): string | undefined {
  const symbolDisplayText = getSymbolDisplayText(currency?.symbol)

  if (symbolDisplayText) {
    return symbolDisplayText
  }

  return tokenAddressString && getValidAddress(tokenAddressString, true)
    ? shortenAddress(tokenAddressString)
    : tokenAddressString
}

const DEFAULT_MAX_SYMBOL_CHARACTERS = 6

export function getSymbolDisplayText(symbol: Maybe<string>): Maybe<string> {
  if (!symbol) {
    return symbol
  }

  return symbol.length > DEFAULT_MAX_SYMBOL_CHARACTERS
    ? symbol?.substring(0, DEFAULT_MAX_SYMBOL_CHARACTERS - 3) + '...'
    : symbol
}

// TODO gary need to reconcile this enum with a central list of selectable currencies later
export type SupportedCurrency = Extract<
  ServerCurrency,
  | ServerCurrency.Aud
  | ServerCurrency.Brl
  | ServerCurrency.Cad
  | ServerCurrency.Eur
  | ServerCurrency.Gbp
  | ServerCurrency.Hkd
  | ServerCurrency.Idr
  | ServerCurrency.Inr
  | ServerCurrency.Jpy
  | ServerCurrency.Ngn
  | ServerCurrency.Pkr
  | ServerCurrency.Rub
  | ServerCurrency.Sgd
  | ServerCurrency.Thb
  | ServerCurrency.Try
  | ServerCurrency.Uah
  | ServerCurrency.Usd
  | ServerCurrency.Vnd
>

const SOURCE_CURRENCY = ServerCurrency.Usd // Assuming that all incoming values in the app are in USD

export function useFiatConversion(
  fromAmount = 0,
  toCurrency: SupportedCurrency = ServerCurrency.Eur // TODO gary placeholder until in app currency selection
): { amount: number; currency: ServerCurrency } {
  const featureEnabled = useFeatureFlag(FEATURE_FLAGS.CurrencyConversion)

  const { data: latestConversion, previousData: prevConversion } = useConvertQuery({
    variables: { fromCurrency: SOURCE_CURRENCY, toCurrency },
    pollInterval: PollingInterval.Slow,
  })

  const conversion = latestConversion || prevConversion
  const conversionRate = conversion?.convert?.value
  const conversionCurrency = conversion?.convert?.currency

  const defaultResult = { amount: fromAmount, currency: SOURCE_CURRENCY }

  if (!featureEnabled || SOURCE_CURRENCY === toCurrency || !conversionRate || !conversionCurrency) {
    return defaultResult
  }

  return { amount: fromAmount * conversionRate, currency: conversionCurrency }
}

export function useFiatConversionFormatted(
  fromAmount: Maybe<number | string>,
  numberType: FiatNumberType,
  toCurrency: SupportedCurrency = ServerCurrency.Eur // TODO gary placeholder until in app currency selection
): string {
  let amountNumber = typeof fromAmount === 'string' ? parseFloat(fromAmount) : fromAmount ?? 0
  if (isNaN(amountNumber)) {
    amountNumber = 0
  }
  const conversion = useFiatConversion(amountNumber, toCurrency)

  if (fromAmount == null || fromAmount === undefined) {
    return '-'
  }

  return formatFiatNumber(conversion.amount, numberType, conversion.currency.toString())
}

export function useAppCurrency(): { symbol: string; code: string } {
  const featureEnabled = useFeatureFlag(FEATURE_FLAGS.CurrencyConversion)
  if (!featureEnabled) {
    return { symbol: '$', code: 'USD' }
  }

  // TODO gary placeholder replace with real locale and currency
  const symbol = (0)
    .toLocaleString('en-US', {
      style: 'currency',
      currency: 'eur',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    .replace(/\d/g, '')
    .trim()

  return {
    symbol,
    code: 'EUR', // May not be translated because ISO codes are only available in English
  }
}