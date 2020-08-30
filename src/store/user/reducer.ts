import { AnyAction } from 'redux'
import { SET_CURRENT_USER } from './constant'

export type BreadItemType = {
  path: string
  breadcrumb: string
}

export type BreadsType = BreadItemType[]

export type MenuConfigType = {
  path: string
  title: string
  icon: string
  hidden: boolean
  routes?: MenuConfigType[]
}

export type CurrentUserType = {
  avatar: string
  enable: boolean
  fullName: string
  id: number
  resources: Array<{
    id: number
    code: string
  }>
  roleIds: number[]
  roleNames: string[]
  userName: string
  resourceCodes: string[]
  [key: string]: any
}

export type UserStoreType = {
  currentUser: CurrentUserType
  menus: MenuConfigType[]
  breads: BreadsType
}

const initialState: UserStoreType = {
  currentUser: {} as CurrentUserType,
  menus: [],
  breads: []
}

export default (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        currentUser: action.data.currentUser as CurrentUserType,
        menus: action.data.menus as MenuConfigType[],
        breads: action.data.breads as BreadsType
      }
    default:
      return initialState
  }
}
