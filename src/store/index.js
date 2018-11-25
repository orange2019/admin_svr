import Vue from 'vue'
import Vuex from 'vuex'
import Reqeust from './../api/common/request'
import Editor from './../utils/editor'

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
      listCurrentNum:10,
      listLimit: 1
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
    }
  }
})

export function createStore() {
  return store
}