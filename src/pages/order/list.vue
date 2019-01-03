<template>
  <div class="page-order-list">
    <div class="page-mall-list-top row">
      <div class="col-3">
        <input type="text" v-model="searchKey" class="form-control" placeholder="输入订单号">
      </div>
      <div class="col-3">
        <a href="javascript:" class="btn btn-sm" @click="searchOrderNo">搜索</a>
      </div>
      <div class="col-12">
        <hr>
      </div>
    </div>
    <div>
      <ul class="nav">
        <!-- -1:已取消,0:已完成,1:已下单,2:已付款,3:已发货 -->
        <li class="nav-item">
          <a class="nav-link" :class="navLink[0]" href="javascript:;" @click="chooseOrder(0)">全部</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" :class="navLink[1]" href="javascript:;" @click="chooseOrder(1)">已完成</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" :class="navLink[2]" href="javascript:;" @click="chooseOrder(2)">已下单</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" :class="navLink[3]" href="javascript:;" @click="chooseOrder(3)">已付款</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" :class="navLink[4]" href="javascript:;" @click="chooseOrder(4)">已发货</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" :class="navLink[5]" href="javascript:;" @click="chooseOrder(5)">已取消</a>
        </li>
      </ul>
    </div>

    <div class="table-responsive mt-3">
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
    return {
      searchKey: "",
      navLink: [
        { disabled: true },
        { disabled: false },
        { disabled: false },
        { disabled: false },
        { disabled: false },
        { disabled: false },
      ]
    };
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
    pageChange(num, where = {}) {
      this.$store.state.listCurrentNum = num;
      let query = this.$route.query;
      console.log("query", query);
      let pushQuery = {};
      Object.keys(query).forEach(key => {
        if (key != "page" && key != "where") {
          pushQuery[key] = query[key];
        }
      });
      pushQuery.page = num;
      console.log("pageChange.pushQuery", pushQuery,where);
      this.$router.push({
        path: "/order",
        query: pushQuery
      });
      let body = { where: where }
      this.$store.dispatch("orderList", {
        route: this.$route,
        body: body
      });
      
    },
    searchOrderNo() {
      let keyword = this.searchKey;
      this.pageChange(1, { keyword: keyword });
      this.setNavLink(0);
    },
    setNavLink(type) {
      for (let index = 0; index < this.navLink.length; index++) {
        if (index == type) {
          this.navLink[index].disabled = true;
        } else {
          this.navLink[index].disabled = false;
        }
      }
    },
    chooseOrder(type = 0) {
      // -1:已取消,0:已完成,1:已下单,2:已付款,3:已发货
        let where = {};
        switch(type){
          case 1:
            where.status = 0;
            this.$router.push({ path: "/order", query: { status: 0, page: 1 } });
            break;
          case 2:
            where.status = 1;
            this.$router.push({ path: "/order", query: { status: 1, page: 1 } });
            break;
          case 3:
            where.status = 2;
            this.$router.push({ path: "/order", query: { status: 2, page: 1 } });
            break;
          case 4:
            where.status = 3;
            this.$router.push({ path: "/order", query: { status: 3, page: 1 } });
            break;
          case 5:
            where.status = -1;
            this.$router.push({ path: "/order", query: { status: -1, page: 1 } });
            break;
          default:
            this.$router.push({ path: "/order", query: { page: 1 } });
        }

        this.setNavLink(type);
        this.pageChange(1, where);
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