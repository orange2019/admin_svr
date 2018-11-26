// const Request = require('./../../api/common/request')
import Request from './../../api/common/request'

class NewsStore {

  async getList(state, route){
    let query = route.query;
    // console.log("/api/news/list.query", query);
    query.page = parseInt(route.query.page) || 1
    query.limit = parseInt(route.query.limit) || state.listLimit || 10
    state.listCurrentNum = query.page
    // let searchKeyword = query.keyword || ''
    // store.state.searchKeyword = searchKeyword
    console.log("/api/news/list.query", query);

    let ret = await Request.get("/api/news/list", query)

    console.log("request news list ret", ret);
    state.listItems = ret.data.list;
    state.listCount = ret.data.count;

    return ret
  }
}

export default new NewsStore