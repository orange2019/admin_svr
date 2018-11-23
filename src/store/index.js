import Vue from 'vue'
import Vuex from 'vuex'
import {
  getCount
} from './../api'

Vue.use(Vuex)

const store = new Vuex.Store({
  state(){
    return {count: 0,lists:[]}
  },
  mutations: {
    increment(state, num) {
      state.count = num
    },
    getLists(state, lists) {
      state.lists = lists
    }
  },
  actions: {
    async incrementSync({
      commit,
      state
    }) {
      let data = {
        count: 0
      }
      let res = await getCount(data)

      commit('increment', res.count)

    },
    async incrementSyncClick({
      commit,
      state
    }) {
      let data = {
        count: state.count || 0
      }
      let res = await getCount(data)

      commit('increment', res.count)

    }
  }
})

export function createStore() {
  return store
}