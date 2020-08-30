import React, { lazy, Suspense } from 'react'
import { Redirect } from 'react-router-dom'
import { RouteConfig } from 'react-router-config'

import RouterLoading from '@/components/router-loading'
import BlankLayout from '@/layouts/blank'
import BasicLayout from '@/layouts/basic'

import Login from '@/views/login'
import Exception404 from '@/views/exception/404'
import withAuthRouter from '@/hoc/withAuthRouter'
import withNoAuthRouter from '@/hoc/withNoAuthRouter'
import Dashboard from '@/views/dashboard'

const loadable = (path: string) => {
  const HocWrappedSuspense: React.FC = (props) => {
    const asyncComponent = () => import(/* webpackChunkName: '[request]' */`@/views/${path}`)
    const Component = lazy(asyncComponent)
    return (
      <Suspense fallback={<RouterLoading />}>
        <Component {...props}/>
      </Suspense>
    )
  }
  return HocWrappedSuspense
}

export interface CommonRouteConfig extends RouteConfig{
  path?: string
  hidden?: boolean
  title?: string
  icon?: string
  auth?: string[]
  routes?: CommonRouteConfig[]
  [propName: string]: any
}

export const basicRoutes: CommonRouteConfig[] = [
  {
    path: '/dashboard',
    exact: true,
    // component: withAuthRouter(loadable('dashboard')),
    component: Dashboard,
    title: '仪表盘',
    icon: 'DesktopOutlined'
  },
  {
    path: '/base',
    component: BlankLayout,
    title: '组件',
    icon: 'AppstoreOutlined',
    routes: [
      {
        path: '/base/clipboard',
        exact: true,
        component: withAuthRouter(loadable('base/clipboard')),
        title: '复制'
      },
      {
        path: '/base/qrcode',
        exact: true,
        component: withAuthRouter(loadable('base/qrcode')),
        title: '二维码'
      }
    ]
  },
  {
    path: '/user',
    exact: true,
    component: withAuthRouter(loadable('user')),
    title: '账号管理',
    icon: 'UserOutlined'
  },
  {
    path: '/role',
    exact: true,
    component: withAuthRouter(loadable('role')),
    title: '角色管理',
    icon: 'icon-role'
  },
  {
    path: '/resource',
    exact: true,
    component: withAuthRouter(loadable('resource')),
    title: '权限管理',
    icon: 'icon-resources'
  },
  {
    path: '*',
    component: Exception404,
    hidden: true
  }
]

const routes: CommonRouteConfig[] = [
  {
    path: '/',
    exact: true,
    render: () => (
      <Redirect to={'/dashboard'} />
    ),
    hidden: true
  },
  {
    path: '/login',
    exact: true,
    component: withNoAuthRouter(Login),
    hidden: true
  },
  {
    name: 'BasicLayout',
    component: BasicLayout,
    routes: basicRoutes
  },
  {
    path: '*',
    component: Exception404,
    hidden: true
  }
]

export default routes
