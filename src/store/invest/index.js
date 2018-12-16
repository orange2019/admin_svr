import Request from './../../api/common/request'

class InvestStore {

  async getList(state, route) {

    let ret = await Request.post('/api/invest/list')
    console.log('InvestStore.getList ret', ret)

    if (ret.code == 0) {
      state.investList = ret.data.list
    }
  }

  async getDetail(state, route) {
    if (!route.query.id) {
      state.investDetail = {}
      return
    }

    let ret = await Request.post('/api/invest/info', {
      id: route.query.id
    })

    if (ret.code == 0) {
      state.investDetail = ret.data
    }
  }


}

export default new InvestStore