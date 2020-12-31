import 'react-app-polyfill/ie9'
import 'react-app-polyfill/stable'
// import 'mobx-react-lite/batchingForReactDom'
import React from 'react'
import ReactDOM from 'react-dom'
import './utils/window'
import App from './App'

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render')
  whyDidYouRender(React, {
    trackAllPureComponents: true
  })
}

if (process.env.NODE_ENV !== 'development') {
  console.log(`last delopy: %c${process.env.NOW}`, 'color: #67C23A')
}

// React.StrictMode
ReactDOM.render(
  <App />,
  document.getElementById('root')
)
