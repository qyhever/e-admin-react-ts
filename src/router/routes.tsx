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
        path: '/basic/base/chart',
        component: BlankLayout,
        title: '图表',
        icon: 'LineChartOutlined',
        routes: [
          {
            path: '/basic/base/chart/echarts',
            exact: true,
            component: withAuthRouter(lazyComponent('base/chart/echarts')),
            title: 'echarts'
          },
          {
            path: '/basic/base/chart/highcharts',
            exact: true,
            component: withAuthRouter(lazyComponent('base/chart/highcharts')),
            title: 'highcharts'
          },
          {
            path: '*',
            component: Exception404,
            hidden: true
          }
        ]
      },
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
    path: '/basic/richtext',
    title: '富文本',
    icon: 'EditOutlined',
    component: BlankLayout,
    routes: [
      {
        path: '/basic/richtext/quill',
        component: withAuthRouter(lazyComponent('richtext/quill')),
        title: 'quill'
      },
      {
        path: '/basic/richtext/tinymce',
        component: withAuthRouter(lazyComponent('richtext/tinymce')),
        title: 'tinymce'
      },
      {
        path: '/basic/richtext/braft',
        component: withAuthRouter(lazyComponent('richtext/braft')),
        title: 'braft'
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
    path: '/basic/admin',
    component: withAuthRouter(lazyComponent('permission/admin')),
    exact: true,
    title: 'admin',
    icon: 'icon-admin',
    auth: ['adminPage']
  },
  {
    path: '/basic/dev',
    component: withAuthRouter(lazyComponent('permission/dev')),
    exact: true,
    title: 'dev',
    icon: 'icon-dev',
    auth: ['devPage']
  },
  {
    path: '/basic/operation',
    component: withAuthRouter(lazyComponent('permission/operation')),
    exact: true,
    title: 'operation',
    icon: 'icon-operation',
    auth: ['operationPage']
  },
  {
    path: '/basic/guest',
    component: withAuthRouter(lazyComponent('permission/guest')),
    exact: true,
    title: 'guest',
    icon: 'icon-guest',
    auth: ['guestPage']
  },
  {
    path: '/basic/test',
    component: withAuthRouter(lazyComponent('permission/test')),
    exact: true,
    title: 'test',
    icon: 'icon-test',
    auth: ['testPage']
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
