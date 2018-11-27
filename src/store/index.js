import Vue from 'vue'
import Vuex from 'vuex'
import Reqeust from './../api/common/request'
import Editor from './../utils/editor'
import NewsStore from './news/index'
import UserStore from './user/index'
import ConfigStore from './config/index'

Vue.use(Vuex)

const store = new Vuex.Store({
  state(){
    return {
      EDITOR: Editor,
      admin: {},
      newsData : {
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
      listItems : [],
      listCount: 0,
      listCurrentNum:1,
      listLimit: 10,
      userInvestInfo: [],
      userInvestLogs: [],
      config: {
        rateLevel: '',
        investList: []
      },
      configRateLevel: '',
      configInvestList: []
    }
  },
  mutations: {
    
  },
  actions: {
    async check({state}) {
      let ret = await Reqeust.post('/api/auth/check')
      console.log('reqeust /api/auth/check' , ret)
      if(ret.code === 0){
        state.admin = {
          id: ret.data.id,
          email: ret.data.email,
          type: ret.data.type
        }
        console.log('reqeust /api/auth/check state.admin' , state.admin)
      }else {
        state.admin = null
        // location.href = '/login'
      }
    },
    async logout({state}){
      let ret = await Reqeust.post('/api/auth/logout')
      console.log('request /api/auth/logout ret' , ret)
      state.admin = null
    },
    async newsListGet({state} , data){
      return await NewsStore.getList(state , data.route)
    },
    async userListGet({state} , data){
      return await UserStore.getList(state , data.route , data.body || {})
    },
    async userTransactionListGet({state} , data){
      return await UserStore.getTransactionList(state , data.route , data.body || {})
    },
    async userTransactionItemApply({state} , data){
      return await UserStore.transactionItemApply(state , data)
    },
    async configGet({state}, data){
      return await ConfigStore.getConfig(state , data.name)
    },
    async configSubmit({state} , data){
      return await ConfigStore.submitConfig(state , data)
    }
  }
})

export function createStore() {
  return store
}