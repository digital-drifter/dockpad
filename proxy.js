const host = process.env.PROXY_HOST || '0.0.0.0'
const port = process.env.PROXY_PORT || 8888

const cors_proxy = require('cors-anywhere')

cors_proxy.createServer({
  originWhitelist: [],
  requireHeader: ['origin', 'x-requested-with'],
  removeHeaders: ['cookie', 'cookie2']
}).listen(port, host, function () {
  console.log('Running CORS Anywhere on ' + host + ':' + port)
})