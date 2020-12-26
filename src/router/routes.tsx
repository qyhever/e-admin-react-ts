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

function lazyComponent(path: string) {
  return lazy(() => import(/* webpackChunkName: '[request]' */`@/views/${path}`))
}

export const basicRoutes: RouteConfig[] = [
  {
    path: '/basic/dashboard',
    exact: true,
    // component: withAuthRouter(loadable('dashboard')),
    component: Dashboard,
    title: '仪表盘',
    icon: 'DesktopOutlined'
  },
  {
    path: '/basic/base',
    component: BlankLayout,
    title: '组件',
    icon: 'AppstoreOutlined',
    routes: [
      {
        path: '/basic/base/clipboard',
        exact: true,
        component: withAuthRouter(lazyComponent('base/clipboard')),
        title: '复制'
      },
      {
        path: '/basic/base/qrcode',
        exact: true,
        component: withAuthRouter(lazyComponent('base/qrcode')),
        title: '二维码'
      },
      {
        path: '*',
        component: Exception404,
        hidden: true
      }
    ]
  },
  {
    path: '/basic/user',
    exact: true,
    component: withAuthRouter(lazyComponent('user')),
    title: '账号管理',
    icon: 'UserOutlined'
  },
  {
    path: '/basic/role',
    exact: true,
    component: withAuthRouter(lazyComponent('role')),
    title: '角色管理',
    icon: 'icon-role'
  },
  {
    path: '/basic/resource',
    exact: true,
    component: withAuthRouter(lazyComponent('resource')),
    title: '权限管理',
    icon: 'icon-resources'
  },
  {
    path: '/basic/403',
    component: Exception403,
    hidden: true
  },
  {
    path: '*',
    component: Exception404,
    hidden: true
  }
]

const routes: RouteConfig[] = [
  {
    path: '/',
    exact: true,
    render: () => (
      <Redirect to={'/basic/dashboard'} />
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
    path: '/basic',
    component: BasicLayout,
    routes: basicRoutes
  },
  {
    path: '*',
    hidden: true,
    component: Exception404
  }
]

export default routes
