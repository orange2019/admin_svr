import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Home from './pages/main.vue'
import Login from './pages/login.vue'
import NewsUpdate from './pages/news/update.vue'

let routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/news/update',
    component: NewsUpdate
  }
]

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: routes
  })
}