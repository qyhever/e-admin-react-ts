import { action, observable } from 'mobx'
import { login } from '@/views/login/service'
import { setToken, setUser, getUser } from '@/utils/local'
import { getAccessMenus, getFlattenMenus } from '@/utils'
import { basicRoutes as routes } from '@/router/routes'
import { history } from '@/utils/history'
import { LoginParamsType } from '@/views/login/service'

export type BreadItemType = {
  path: string
  breadcrumb: string
}

export type BreadsType = BreadItemType[]

export type MenuItemType = {
  path: string
  title: string
  icon: string
  hidden: boolean
  routes?: MenuItemType[]
}

export type CurrentUserType = {
  token: string
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
  menus: MenuItemType[]
  breads: BreadsType
}

class User {
  constructor() {
    const localUser = getUser()
    if (localUser) {
      this.initUserData(localUser)
    } else {
      history.replace('/login')
    }
  }
  @observable currentUser = {} as CurrentUserType

  @observable menus = [] as MenuItemType[]

  @observable breads = [] as BreadItemType[]

  @action loginByAccount = async (data: LoginParamsType) => {
    const res = await login(data)
    const user = res.userInfo
    user.resourceCodes = user.resources.map((item: {code: string}) => item.code)
    await this.initUserData(user)
  }

  @action initUserData = async (data: CurrentUserType) => {
    setToken(data.token) // set local
    setUser(data) // set local

    const menus = getAccessMenus(routes, data.resourceCodes)
    const breads = [...getFlattenMenus(routes), { path: '/', breadcrumb: '首页' }]

    this.currentUser = data
    this.menus = menus
    this.breads = breads
  }
}

export default new User()
