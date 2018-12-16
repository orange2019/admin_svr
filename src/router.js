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
import UserAssets from './pages/user/assets.vue'
import UserInvite from './pages/user/invite.vue'
import Config from './pages/config/index.vue'
import Assets from './pages/assets/index.vue'
import Invest from './pages/invest/index.vue'
import InvestUpdate from './pages/invest/update.vue'

let routes = [{
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
    path: '/user',
    component: UserList
  },
  {
    path: '/user/invest',
    component: UserInvest
  },
  {
    path: '/user/assets',
    component: UserAssets
  },
  {
    path: '/user/transaction',
    component: UserTransaction
  },
  {
    path: '/assets',
    component: Assets
  },
  {
    path: '/config',
    component: Config
  },
  {
    path: '/invest',
    component: Invest
  },
  {
    path: '/invest/Update',
    component: InvestUpdate
  },
  {
    path: '/user/invite',
    component: UserInvite
  }
]

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: routes

  })
}