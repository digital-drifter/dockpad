import Vue, { CreateElement } from 'vue'
import './plugins/vuetify'
import Bitbucket from './plugins/bitbucket'
import Docker from './plugins/docker'
import Emitter from './plugins/emitter'
import Http from './plugins/http'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import DockerOptions from './config/docker.json'

Vue.config.productionTip = false

Vue.use(Bitbucket, {
  key: process.env.VUE_APP_BITBUCKET_OAUTH_KEY,
  secret: process.env.VUE_APP_BITBUCKET_OAUTH_SECRET
})

Vue.use(Docker, DockerOptions)

Vue.use(Emitter)

Vue.use(Http, {
  host: process.env.VUE_APP_PROXY_HOST,
  port: process.env.VUE_APP_PROXY_PORT
})

const app = new Vue({
  render: (h: CreateElement) => h(App),
  router
}).$mount('#app')
