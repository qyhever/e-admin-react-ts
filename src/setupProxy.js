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
  app.post('/upload', (req, res) => {
    setTimeout(() => {
      res.send({
        key: 'https://qiniu.qyhever.com/15879321501070c8ed05f88249photo_2019-09-06_17-12-29.jpg'
      })
    }, 1000)
  })
}