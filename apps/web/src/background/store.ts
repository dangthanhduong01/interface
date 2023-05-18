import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { combineReducers } from 'redux'
import { persistReducer, persistStore } from 'redux-persist'
import { ForkEffect, SelectEffect } from 'redux-saga/effects'
import { SagaGenerator, select, spawn } from 'typed-redux-saga'
import { createStore, RootState } from 'wallet/src/state'
import { persistConfig, sharedReducers } from 'wallet/src/state/reducer'
import { wrapStore } from 'webext-redux'
import { PortName } from '../types'
import { dappReducer } from './features/dapp/slice'
import { dappRequestApprovalWatcher } from './features/dappRequests/dappRequestApprovalWatcherSaga'
import { dappRequestWatcher, extensionRequestWatcher } from './features/dappRequests/saga'
import { dappRequestReducer } from './features/dappRequests/slice'

export const webReducers = {
  ...sharedReducers,
  dapp: dappReducer,
  dappRequests: dappRequestReducer,
} as const

const webReducer = persistReducer(persistConfig, combineReducers(webReducers))

export function initializeStore(
  portName: PortName = PortName.Store
): Promise<ReturnType<typeof createStore> | undefined> {
  return new Promise((resolve) => {
    const store = createStore({
      reducer: webReducer,
      additionalSagas: [webRootSaga],
    })

    // https://github.com/tshaddix/webext-redux/issues/286#issuecomment-1347985776
    Object.assign(store, {
      dispatch: store.dispatch.bind(store),
      getState: store.getState.bind(store),
      subscribe: store.subscribe.bind(store),
    })

    persistStore(store, null, () => resolve(store))

    // proxy store with webext-redux to simplify cross-thread communication
    wrapStore(store, { portName })
  })
}

// TODO: set up lint rule to prevent imports from packages/wallet
export type WebState = ReturnType<typeof webReducer> & RootState
export type AppDispatch = ReturnType<typeof createStore>['dispatch']
export type AppSelector<T> = (state: WebState) => T

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<WebState> = useSelector

// Use in sagas for better typing when selecting from redux state
export function* appSelect<T>(fn: (state: WebState) => T): SagaGenerator<T, SelectEffect> {
  const state = yield* select(fn)
  return state
}

const sagasInitializedOnStartup = [
  dappRequestWatcher,
  dappRequestApprovalWatcher,
  extensionRequestWatcher,
] as const

export function* webRootSaga(): Generator<ForkEffect<void>> {
  for (const s of sagasInitializedOnStartup) {
    yield* spawn(s)
  }
}
