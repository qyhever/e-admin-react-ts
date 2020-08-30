import React, { Component } from 'react'
import { RouteConfig } from 'react-router-config'
import { connect } from 'react-redux'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { getToken } from '@/utils/local'
import { AppState } from '@/store'
import { UserStoreType } from '@/store/user/reducer'
import { hasPermission } from '@/utils'

type IProps = RouteConfig & RouteComponentProps & {
  user: UserStoreType
}

function withAuthRouter(OriginalComponent: React.ComponentType) {
  class HocWrappedAuthRouter extends Component<IProps> {
    render() {
      const token = getToken()
      if (!token) {
        return <Redirect to={{ pathname: '/login' }} />
      }
      const { route, user } = this.props
      const hasAuth = hasPermission(route, user.currentUser.resourceCodes)
      if (!hasAuth) {
        return <Redirect to={{ pathname: '/403' }} />
      }
      return (
        <OriginalComponent {...this.props} />
      )
    }
  }
  const mapStateToProps = ({ user }: AppState) => ({
    user
  })
  return connect(mapStateToProps)(HocWrappedAuthRouter)
}
export default withAuthRouter
