import React, { Component } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { getDisplayName } from '@/utils'
import { clearPending } from '@/api/request'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

type IProps = RouteComponentProps

export default function withNProgress(WrappedComponent: React.ComponentType) {
  return class extends Component<IProps> {
    static displayName = `WithNProgress(${getDisplayName(WrappedComponent)})`
    private unlisten: () => void = () => {} // eslint-disable-line
    private timer: number | undefined
    componentDidMount() {
      !NProgress.isRendered() && NProgress.start()
      this.unlisten = this.props.history.listen(() => {
        // 路由跳转时，取消上个路由还未完成的请求
        clearPending()
        !NProgress.isRendered() && NProgress.start()
      })
      this.timer = window.setTimeout(() => {
        NProgress.done()
      }, 300)
    }

    componentDidUpdate() {
      NProgress.done()
    }

    componentWillUnmount() {
      NProgress.done()
      clearTimeout(this.timer)
      this.unlisten()
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }
}
