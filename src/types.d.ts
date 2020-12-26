// import { compose } from 'redux'
declare global {
  interface Window {
    // __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose
    QINIU_UPLOAD_URL: string
    QINIU_PREFIX: string
  }
}

// export {}
