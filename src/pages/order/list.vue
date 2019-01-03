<template>
  <div class="page-order-list">
    <div class="page-mall-list-top row">
      <div class="table-responsive">
        <table class="table table-hover">
          <thead>
            <tr>
              <th>订单号</th>
              <th>地址</th>
              <th>购买商品</th>
              <th>物流单号</th>
              <th>总金额</th>
              <th>订单状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items">
              <td>{{item.order_no}}</td>
              <td>
                <p>联系人:{{item.address ? item.address.name : ''}}</p>
                <p>联系方式:{{item.address ? item.address.mobile : ''}}</p>
                <p>地址:{{item.address ? item.address.info : ''}}</p>
              </td>
              <td>
                <p v-for="good in item.goods_items">{{good.name}}</p>
              </td>
              <td>{{item.logistics_no}}</td>
              <td>{{item.amount}}</td>
              <td>{{getStatus(item.status)}}</td>
              <td>
                <router-link
                  :to="{ path : 'order/update' , query : {id : item.id }}"
                  class="btn btn-outline-primary btn-sm"
                >详情及管理</router-link>
                <a
                  v-if="item.status == 2"
                  href="javascript:;"
                  @click="orderShip(item.id)"
                  class="btn btn-outline-success btn-sm"
                >发货</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="page-pagination">
      <hr>
      <my-pagination
        :total="count"
        :display="size"
        :currentPage="currentPage"
        @pageChange="pageChange"
      ></my-pagination>
    </div>
  </div>
</template>
<script>
import Request from "./../../api/common/request";
export default {
  data() {
    return {};
  },
  asyncData({ store, route }) {
    store.dispatch("orderList", { route: route });
  },
  computed: {
    items() {
      return this.$store.state.listItems;
    },
    count() {
      return this.$store.state.listCount;
    },
    size() {
      return this.$store.state.listLimit;
    },
    currentPage() {
      return this.$store.state.listCurrentNum;
    }
  },
  methods: {
    pageChange(num) {
      // this.$store.state.listCurrentNum = num
      let query = this.$route.query;
      let pushQuery = {};
      Object.keys(query).forEach(key => {
        if (key != "page") {
          pushQuery[key] = query[key];
        }
      });
      pushQuery.page = num;
      // console.log('pageChange.query' , query)
      this.$router.push({ path: "/order", query: pushQuery });
      this.$store.dispatch("orderList", { route: this.$route });
      // setTimeout(() => {
      //   this.$router.go(0)
      // }, 0);
      //
    },
    async orderShip(id) {
      if (confirm("确认发货?")) {
        let ret = await Request.post("/api/order/orderModify", {
          id: id,
          status: 3
        });
        if (ret.code == 0) {
          this.$router.go(0);
          // alert("成功");
        } else {
          alert("删除失败");
        }
      }
    },
    getStatus(statusNums) {
      let statusFields = {
        "-1": "已取消",
        "0": "已完成",
        "1": "已下单",
        "2": "已付款",
        "3": "已发货"
      };
      return statusFields[statusNums];
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {});
  }
};
</script>