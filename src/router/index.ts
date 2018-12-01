import Vue from 'vue'
import VueRouter, { Route, RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: RouteConfig[] = [
  {
    name: 'bitbucket.authenticated',
    path: '/bitbucket/authenticated',
    beforeEnter: (to: Route, from: Route, next: any) => {
      window.opener.postMessage(to.query)

      next()
    }
  }
]

export default new VueRouter({
  mode: 'history',
  routes
})
