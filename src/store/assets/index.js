import Request from './../../api/common/request'

class AssetsStore {

  async getInfo(state) {

    let ret = await Request.get('/api/assets/tokenInfo')
    console.log('AssetsStore.getInfo ret', ret)

    // state.config[configName] = ret.data ? (ret.data.info || null) : null
    if (ret.code == 0) {
      state.tokenInfo = ret.data
    }
  }


}

export default new AssetsStore