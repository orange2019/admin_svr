
import Request from './../../api/common/request'

class NewsStore {

  async getList(state, route , body = {}){
    let query = route.query;
    // console.log("/api/news/list.query", query);
    query.page = parseInt(route.query.page) || 1
    query.limit = parseInt(route.query.limit) || state.listLimit || 10
    state.listCurrentNum = query.page
    // let searchKeyword = query.keyword || ''
    // store.state.searchKeyword = searchKeyword
    console.log("/api/user/list.query", query);

    body = Object.assign(query , body)
    body.offset = (query.page - 1) * query.limit
    console.log("/api/user/list.body", body);
    let ret = await Request.post("/api/user/list", body)

    console.log("request user list ret", ret);
    state.listItems = ret.data.rows;
    state.listCount = ret.data.count;

    return ret
  }
}

export default new NewsStore