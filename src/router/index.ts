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
  },
  {
    name: 'services',
    path: '/services',
    component: () => import('../components/Services.vue')
  },
  {
    name: 'bitbucket',
    path: '/bitbucket',
    component: () => import('../components/Bitbucket.vue')
  }
]

export default new VueRouter({
  mode: 'history',
  routes
})
