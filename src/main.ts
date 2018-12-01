import Vue, { CreateElement } from 'vue'
import './plugins/vuetify'
import Bitbucket from './plugins/bitbucket'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.config.productionTip = false

Vue.use(Bitbucket, {
  key: process.env.VUE_APP_BITBUCKET_OAUTH_KEY,
  secret: process.env.VUE_APP_BITBUCKET_OAUTH_SECRET
})

new Vue({
  render: (h: CreateElement) => h(App),
  router
}).$mount('#app')
