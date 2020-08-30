import React, { PureComponent } from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { getToken } from '@/utils/local'

function withNoAuthRouter(OriginalComponent: React.ComponentType<RouteComponentProps>) {
  class HocWrappedNoAuthRouter extends PureComponent<RouteComponentProps> {
    render() {
      const token = getToken()
      if (token) {
        return <Redirect to={{ pathname: '/dashboard' }} />
      }
      return (
        <OriginalComponent {...this.props} />
      )
    }
  }
  return HocWrappedNoAuthRouter
}
export default withNoAuthRouter
