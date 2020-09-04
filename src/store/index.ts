import { createContext, useContext } from 'react'
import appStore from './app'
import userStore from './user'

const store = {
  appStore,
  userStore
}

const StoreContext = createContext(store)

export const useRootStore = () => useContext(StoreContext)

export type RootStoreType = ReturnType<typeof useRootStore>

export default store
