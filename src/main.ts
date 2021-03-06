import Vue, { CreateElement } from 'vue'
import './plugins/vuetify'
import './hooks'
import Bitbucket from './plugins/bitbucket'
import Docker from './plugins/docker'
import Emitter from './plugins/emitter'
import Http from './plugins/http'
import WebSocketClient from './plugins/ws'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import DockerOptions from './config/docker.json'

Vue.config.productionTip = false

Vue.use(Bitbucket, {
  key: process.env.VUE_APP_BITBUCKET_OAUTH_KEY,
  secret: process.env.VUE_APP_BITBUCKET_OAUTH_SECRET,
  dir: process.env.VUE_APP_REPO_DIR
})

Vue.use(Docker, DockerOptions)

Vue.use(Emitter)

Vue.use(Http, {
  api: {
    host: process.env.VUE_APP_API_HOST,
    port: process.env.VUE_APP_API_PORT
  },
  proxy: {
    host: process.env.VUE_APP_PROXY_HOST,
    port: process.env.VUE_APP_PROXY_PORT
  }
})

Vue.use(WebSocketClient, {
  host: process.env.VUE_APP_WS_HOST,
  port: process.env.VUE_APP_WS_PORT
})

const app = new Vue({
  render: (h: CreateElement) => h(App),
  router
}).$mount('#app')
