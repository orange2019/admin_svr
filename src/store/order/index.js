import Request from './../../api/common/request'

class OrderStore { 
  async orderList(state, route, body = {}) { 
    let query = route.query;
    query.page = parseInt(route.query.page) || 1
    query.limit = parseInt(route.query.limit) || state.listLimit || 10
    state.listCurrentNum = query.page
    console.log("/api/order/orderList.query", query);
    body.where = Object.assign(query, body.where)
    body.offset = (query.page - 1) * query.limit
    let ret = await Request.post("/api/order/orderList", body)
    console.log('orderList', body);
    state.listItems = ret.data.list;
    state.listCount = ret.data.count;
    return ret
  }
  
}
export default new OrderStore()