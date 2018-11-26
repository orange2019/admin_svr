import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Home from './pages/main.vue'
import Login from './pages/login.vue'
import NewsUpdate from './pages/news/update.vue'
import NewsList from './pages/news/list.vue'
import UserList from './pages/user/list.vue'
import UserInvest from './pages/user/invest.vue'

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
    path: '/news',
    component: NewsList
  },
  {
    path: '/news/update',
    component: NewsUpdate
  },
  {
    path : '/user',
    component : UserList
  },
  {
    path : '/user/invest',
    component : UserInvest
  }

]

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: routes

  })
}