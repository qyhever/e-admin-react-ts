import { AnyAction } from 'redux'
import { TOGGLE_COLLAPSED } from './constant'
import { getCollapse, setCollapse } from '@/utils/local'

const initialState = {
  collapsed: Boolean(getCollapse())
}

export default (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case TOGGLE_COLLAPSED: {
      const value = !state.collapsed
      setCollapse(value)
      return {
        ...state,
        collapsed: value
      }
    }
    default:
      return initialState
  }
}
