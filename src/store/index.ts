import { createStore, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from './reducer'
import { initUserData } from './user/action'
import { getUser } from '@/utils/local'
import { history } from '@/utils/history'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
)
export default store
export type ReducerActionType<T = {}> = {
  type: string
  data: T
}
// 初始化用户信息
const user = getUser()
if (user) {
  initUserData(store.dispatch, user)
} else {
  history.replace('/login')
}
export type AppState = ReturnType<typeof rootReducer>
