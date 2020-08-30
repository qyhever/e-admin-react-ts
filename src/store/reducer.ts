import { combineReducers } from 'redux'
import user from './user/reducer'
import app from './app/reducer'

export default combineReducers({
  app,
  user
})
