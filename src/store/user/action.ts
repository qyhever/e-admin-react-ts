import { Dispatch } from 'redux'
import { SET_CURRENT_USER } from './constant'
import { login, LoginParamsType } from '@/views/login/service'
import { setToken, setUser } from '@/utils/local'
import { getAccessMenus, getFlattenMenus } from '@/utils'
import { basicRoutes as routes } from '@/router/routes'
import { history } from '@/utils/history'
import { UserStoreType, CurrentUserType } from './reducer'

export const setCurrentUser = (data: UserStoreType) => ({
  type: SET_CURRENT_USER,
  data
})

export function loginByAccount(data: LoginParamsType) {
  return (dispatch: Dispatch) => {
    login(data)
      .then(res => {
        const user = res.userInfo
        user.resourceCodes = user.resources.map((item: { code: string }) => item.code)

        initUserData(dispatch, {
          user,
          token: res.token
        })
        
        setTimeout(() => {
          history.replace('/dashboard')
        }, 20)
      })
  }
}

export const initUserData = (
  dispatch: Dispatch,
  data: {
    user: Record<string, any>,
    token: string
  }
) => {
  const { user, token } = data
  setToken(token) // set local
  setUser({ user, token }) // set local

  const menus = getAccessMenus(routes, user.resourceCodes)
  const breads = [...getFlattenMenus(routes), { path: '/', breadcrumb: '首页' }]
  dispatch(setCurrentUser({
    currentUser: user as CurrentUserType,
    menus,
    breads
  }))
}
