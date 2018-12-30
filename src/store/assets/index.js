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

  async getAssetsOutList(state, route, body = {}) {
    let query = route.query;
    // console.log("/api/news/list.query", query);
    query.page = parseInt(route.query.page) || 1
    query.limit = parseInt(route.query.limit) || state.listLimit || 10
    state.listCurrentNum = query.page
    // let searchKeyword = query.keyword || ''
    // store.state.searchKeyword = searchKeyword
    console.log("/api/user/list.query", query);

    body.where = Object.assign(query, body.where)
    body.offset = (query.page - 1) * query.limit
    console.log("/api/user/list.body", body);
    let ret = await Request.post("/api/assets/outList", body)

    console.log("request user list ret", ret);
    state.listItems = ret.data.rows;
    state.listCount = ret.data.count;

    return ret
  }


}

export default new AssetsStore