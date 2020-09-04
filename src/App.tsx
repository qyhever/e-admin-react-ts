import React from 'react'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import { Provider } from 'mobx-react'
import store from './store'
import RouterConfig from './router'

import './assets/styles/index.less'
// inject svg icon into dom
import './assets/icons'

import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')

const App = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <Provider {...store}>
        <RouterConfig/>
      </Provider>
    </ConfigProvider>
  )
}

export default App
