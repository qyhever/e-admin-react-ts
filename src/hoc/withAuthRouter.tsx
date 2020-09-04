import React, { Component, Suspense } from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { MatchedRoute } from 'react-router-config'
import { inject } from 'mobx-react'
import { getToken } from '@/utils/local'
import { hasPermission, getDisplayName } from '@/utils'
import RouterLoading from '@/components/router-loading'
// import hoistStatics from 'hoist-non-react-statics'
import { CurrentUserType } from '@/store/user'

type IProps = MatchedRoute<{}> & RouteComponentProps & {
  userStore: CurrentUserType
}

function withAuthRouter<P extends object>(WrappedComponent: React.ComponentType<P>) {
  class WithAuthRouter extends Component<P & IProps> {
    static displayName = `WithAuthRouter(${getDisplayName(WrappedComponent)})`
    render() {
      const token = getToken()
      if (!token) {
        return <Redirect to={{ pathname: '/login' }} />
      }
      const { route, userStore, ...restProps } = this.props
      const { currentUser } = userStore
      const { resourceCodes } = currentUser
      const hasAuth = hasPermission(route, resourceCodes)
      if (!hasAuth) {
        return <Redirect to={{ pathname: '/403' }} />
      }
      return (
        <Suspense fallback={<RouterLoading />}>
          <WrappedComponent {...restProps as P} />
        </Suspense>
      )
    }
  }
  // WithAuthRouter.displayName = `WithAuthRouter(${getDisplayName(WrappedComponent)})`
  return inject('userStore')(WithAuthRouter)
}
export default withAuthRouter
