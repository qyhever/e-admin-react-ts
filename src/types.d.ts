import { compose } from 'redux'

declare module '*.css'
declare module '*.less'
declare module '*.scss'

// declare module '*.less' {
//   const content: { [key: string]: any }
//   export default content
// }
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose
  }
}

export {}
