import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Home from './pages/Home.vue'

let routes = [{
    path: '/',
    component: Home
  }
]

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: routes
  })
}