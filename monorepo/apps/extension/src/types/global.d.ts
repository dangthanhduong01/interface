declare type Address = string
declare type AddressTo<T> = Record<Address, T>

declare type Nullable<T> = T | null
declare type Maybe<T> = Nullable<T> | undefined

declare type ValuesOf<T extends readonly unknown[]> = T[number]

declare global {
  interface Window {
    ethereum?: UniswapInjectedProvider
    isUniswapExtensionInstalled?: boolean
  }
}