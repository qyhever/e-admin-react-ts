import React, { lazy } from 'react'
import { Redirect } from 'react-router-dom'
import { RouteConfig } from 'react-router-config'

import BlankLayout from '@/layouts/blank'
import BasicLayout from '@/layouts/basic'

import Login from '@/views/login'
import Exception404 from '@/views/exception/404'
import Exception403 from '@/views/exception/403'
import withAuthRouter from '@/hoc/withAuthRouter'
import withNoAuthRouter from '@/hoc/withNoAuthRouter'
import Dashboard from '@/views/dashboard'
import Analysis from '@/views/analysis'

function lazyComponent(path: string) {
  return lazy(() => import(/* webpackChunkName: '[request]' */`@/views/${path}`))
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

export const basicRoutes: RouteConfig[] = [
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
        component: withAuthRouter(lazyComponent('base/clipboard')),
        title: '复制'
      },
      {
        path: '/base/qrcode',
        exact: true,
        component: withAuthRouter(lazyComponent('base/qrcode')),
        title: '二维码'
      }
    ]
  },
  {
    path: '/user',
    exact: true,
    component: withAuthRouter(lazyComponent('user')),
    title: '账号管理',
    icon: 'UserOutlined'
  },
  {
    path: '/role',
    exact: true,
    component: withAuthRouter(lazyComponent('role')),
    title: '角色管理',
    icon: 'icon-role'
  },
  {
    path: '/resource',
    exact: true,
    component: withAuthRouter(lazyComponent('resource')),
    title: '权限管理',
    icon: 'icon-resources'
  },
  {
    path: '/403',
    component: Exception403,
    hidden: true
  }
]

export const blankRoutes: RouteConfig[] = [
  {
    path: '/analysis',
    exact: true,
    component: Analysis,
    title: '分析页',
    icon: 'DesktopOutlined'
  }
]

export const concatRoutes = [
  ...basicRoutes,
  ...blankRoutes
]

const routes: RouteConfig[] = [
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
  ...blankRoutes,
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
