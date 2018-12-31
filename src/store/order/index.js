import Request from './../../api/common/request'

class OrderStore { 
  async orderList(state, route) { 
    let query = route.query;
    query.page = parseInt(route.query.page) || 1
    query.limit = parseInt(route.query.limit) || state.listLimit || 10
    state.listCurrentNum = query.page
    console.log("/api/order/orderList.query", query);
    let ret = await Request.post("/api/order/orderList", query)
    state.listItems = ret.data.list;
    state.listCount = ret.data.count;
    return ret
  }
  
}
export default new OrderStore()