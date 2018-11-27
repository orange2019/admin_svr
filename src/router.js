import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Home from './pages/main.vue'
import Login from './pages/login.vue'
import NewsUpdate from './pages/news/update.vue'
import NewsList from './pages/news/list.vue'
import UserList from './pages/user/list.vue'
import UserInvest from './pages/user/invest.vue'
import UserTransaction from './pages/user/transaction.vue'
import Config from './pages/config/index.vue'


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
  },
  {
    path: '/user/transaction',
    component: UserTransaction
  },
  {
    path : '/config',
    component : Config
  }
]

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: routes

  })
}