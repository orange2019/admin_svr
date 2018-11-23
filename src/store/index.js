import Vue from 'vue'
import Vuex from 'vuex'
import Reqeust from './../api/common/request'

Vue.use(Vuex)

const store = new Vuex.Store({
  state(){
    return {
      admin: {}
    }
  },
  mutations: {
    
  },
  actions: {
    async check({state}) {
      let ret = await Reqeust.post('/api/auth/check')
      console.log('reqeust /api/auth/check' , ret)
      if(ret.code === 0){
        store.state.admin = ret.data
      }else {
        store.state.admin = null
        // location.href = '/login'
      }
    },
    async logout({state}){
      let ret = await Reqeust.post('/api/auth/logout')
      console.log('request /api/auth/logout ret' , ret)
      state.admin = null
    }
  }
})

export function createStore() {
  return store
}