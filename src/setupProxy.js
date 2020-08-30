const proxy = require('http-proxy-middleware')
 
module.exports = function(app) {
  app.use(
    proxy('/api', {
      // target: 'http://localhost:6000',
      target: 'https://qyhever.com/e-admin',
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    })
  )
}