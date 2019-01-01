import Request from './../../api/common/request'

class VideoStore {

  async videoList(state, route){
    let query = route.query;
    query.page = parseInt(route.query.page) || 1
    query.limit = parseInt(route.query.limit) || state.listLimit || 10
    state.listCurrentNum = query.page
    // let searchKeyword = query.keyword || ''
    // store.state.searchKeyword = searchKeyword
    console.log("/api/video/list.query", query);

    let ret = await Request.post("/api/video/list", query)

    console.log("request good list ret", ret);
    state.listItems = ret.data.rows;
    state.listCount = ret.data.count;

    return ret
  }
}

export default new VideoStore()