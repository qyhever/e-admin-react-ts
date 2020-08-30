import { TOGGLE_COLLAPSED } from './constant'
import { AnyAction } from 'redux'

export type ToggleCollapsedType = () => AnyAction

export const toggleCollapsed = () => ({
  type: TOGGLE_COLLAPSED
})
