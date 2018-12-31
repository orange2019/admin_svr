import Vue from 'vue'
import Vuex from 'vuex'
import Reqeust from './../api/common/request'
import Editor from './../utils/editor'
import NewsStore from './news/index'
import UserStore from './user/index'
import ConfigStore from './config/index'
import AssetsStore from './assets/index'
import InvestStore from './invest/index'
import MallStore from './mall/index'
import OrderStore from './order/index'
import CategoryStore from './category/index'

Vue.use(Vuex)

const store = new Vuex.Store({
  state() {
    return {
      loadingText: '',
      EDITOR: Editor,
      admin: {},
      newsData: {
        id: "",
        title: "",
        description: "",
        post_time: "",
        content: "",
        cover: "",
        status: 1,
        type: 0,
        category: "",
        sort: 0
      },
      goodData: {
        id: "",
        c_id: "",
        name: "",
        cover: "",
        info: "",
        description: "",
        price: "",
        stock: 0,
        status: 0,
      },
      orderData: {},
      categoryData: {},
      listItems: [],
      listCount: 0,
      listCurrentNum: 1,
      listLimit: 10,
      userInvestList: [],
      config: {
        rateLevel: '',
        investList: []
      },
      configRateLevel: '',
      configInvestList: [],
      investList: [],
      investDetail: {},
      inviteInfo: {},
      tokenInfo: {}
    }
  },
  mutations: {

  },
  actions: {
    async check({
      state
    }) {
      let ret = await Reqeust.post('/api/auth/check')
      console.log('reqeust /api/auth/check', ret)
      if (ret.code === 0) {
        state.admin = {
          id: ret.data.id,
          email: ret.data.email,
          type: ret.data.type
        }
        console.log('reqeust /api/auth/check state.admin', state.admin)
      } else {
        state.admin = null
        // location.href = '/login'
      }
    },
    async logout({
      state
    }) {
      let ret = await Reqeust.post('/api/auth/logout')
      console.log('request /api/auth/logout ret', ret)
      state.admin = null
    },
    async goodList({
      state
    }, data) {
      return await MallStore.goodList(state, data.route)
    },
    async newsListGet({
      state
    }, data) {
      return await NewsStore.getList(state, data.route)
    },
    async userListGet({
      state
    }, data) {
      return await UserStore.getList(state, data.route, data.body || {})
    },
    async assetsOutListGet({
      state
    }, data) {
      return await AssetsStore.getAssetsOutList(state, data.route, data.body || {})
    },
    async userInviteGet({
      state
    }, data) {
      return await UserStore.getInvite(state, data.route, data.body || {})
    },
    async userListInviteGet({
      state
    }, data) {
      return await UserStore.getListInvite(state, data.route, data.body || {})
    },
    async userTransactionListGet({
      state
    }, data) {
      return await UserStore.getTransactionList(state, data.route, data.body || {})
    },
    async userTransactionItemApply({
      state
    }, data) {
      return await UserStore.transactionItemApply(state, data)
    },
    async configGet({
      state
    }, data) {
      return await ConfigStore.getConfig(state, data.name)
    },
    async configSubmit({
      state
    }, data) {
      return await ConfigStore.submitConfig(state, data)
    },
    async assetsTokenInfoGet({
      state
    }) {
      return await AssetsStore.getInfo(state)
    },
    async getUserInvestList({
      state
    }, data) {
      return await UserStore.getUserInvestList(state, data.route, {})
    },
    async investListGet({
      state
    }, data) {
      return await InvestStore.getList(state, data.route)
    },
    async investDetailGet({
      state
    }, data) {
      return await InvestStore.getDetail(state, data.route)
    },
    async orderList({ state }, data) {
      return await OrderStore.orderList(state,data.route)
    },
    async categoryList({ state }, data) {
      return await CategoryStore.categoryList(state,data.route)
    }
  }
})

export function createStore() {
  return store
}