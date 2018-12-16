import Request from './../../api/common/request'

class NewsStore {

  async getList(state, route, body = {}) {
    let query = route.query;
    // console.log("/api/news/list.query", query);
    query.page = parseInt(route.query.page) || 1
    query.limit = parseInt(route.query.limit) || state.listLimit || 10
    state.listCurrentNum = query.page
    // let searchKeyword = query.keyword || ''
    // store.state.searchKeyword = searchKeyword
    console.log("/api/user/list.query", query);

    body = Object.assign(query, body)
    body.offset = (query.page - 1) * query.limit
    console.log("/api/user/list.body", body);
    let ret = await Request.post("/api/user/list", body)

    console.log("request user list ret", ret);
    state.listItems = ret.data.rows;
    state.listCount = ret.data.count;

    return ret
  }

  async getListInvite(state, route, body = {}) {
    let query = route.query;
    // console.log("/api/news/list.query", query);
    query.page = parseInt(route.query.page) || 1
    query.limit = parseInt(route.query.limit) || state.listLimit || 10
    state.listCurrentNum = query.page
    // let searchKeyword = query.keyword || ''
    // store.state.searchKeyword = searchKeyword
    console.log("/api/user/listInvite.query", query);

    body = Object.assign(query, body)
    body.offset = (query.page - 1) * query.limit
    console.log("/api/user/listInvite.body", body);
    let ret = await Request.post("/api/user/listInvite", body)

    console.log("request user listInvite ret", ret);
    state.listItems = ret.data.rows;
    state.listCount = ret.data.count;

    return ret
  }

  async getInvite(state, route) {

    let body = {}
    body.user_id = route.query.user_id

    let ret = await Request.post('/api/user/inviteInfo', body)

    state.inviteInfo = ret.data
    return ret

  }

  async getTransactionList(state, route, body = {}) {
    let query = route.query;
    // console.log("/api/news/list.query", query);
    query.page = parseInt(route.query.page) || 1
    query.limit = parseInt(route.query.limit) || state.listLimit || 10
    state.listCurrentNum = query.page
    // let searchKeyword = query.keyword || ''
    // store.state.searchKeyword = searchKeyword
    console.log("/api/user/getTransactionList.query", query);

    body = Object.assign(query, body)
    body.offset = (query.page - 1) * query.limit
    console.log("/api/user/getTransactionList.body", body);
    let ret = await Request.post("/api/user/transactionList", body)

    console.log("request user getTransactionList ret", ret);
    state.listItems = ret.data.rows;
    state.listCount = ret.data.count;

    return ret
  }

  async getUserInvestList(state, route, body = {}) {
    let query = route.query

    let ret = await Request.get('/api/user/investInfoAndLogs', query, body)
    console.log("request user getUserInvestList ret", ret);

    state.userInvestList = ret.data.list
    return ret
  }

}

export default new NewsStore