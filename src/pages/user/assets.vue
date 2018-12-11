<template>
  <div class="page-user-list">
    <div class="page-user-list-top row">
      <div class="col-3">
        <input type="text" v-model="searchKey" class="form-control" placeholder="输入手机号码">
      </div>
      <div class="col-1">
        <a href="javascript:" class="btn btn-sm" @click="searchUser">搜索</a>
      </div>
      <div class="col-8 text-right"></div>

      <div class="col-12">
        <hr>
      </div>
    </div>

    <div class="table-responsive" v-if="count">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>电话号码</th>
            <th>姓名</th>
            <th>钱包地址</th>
            <th>资产</th>
            <th>状态</th>
            <th>操作</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items">
            <td>{{ item.mobile }}</td>
            <td>{{item.user_info ? item.user_info.realname : ''}}</td>
            <th>{{ item.wallet_address }}</th>
            <th>
              <a href="javascript:alert('TODO')">查看</a>
            </th>
            <td>
              <span v-if="item.status == 0" class="text-danger">禁用</span>
              <span v-if="item.status == 1" class="text-success">正常</span>
            </td>
            <td>
              <!-- <router-link
                :to="{path : '/user/invest' , query : {user_id : item.id}}"
                class="btn btn-link"
              >投产信息</router-link>-->
            </td>
          </tr>
        </tbody>
      </table>

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
    <div v-else>
      <p class="text-center">无数据</p>
    </div>
  </div>
</template>

<script>
import Request from "./../../api/common/request";
import Moment from "moment";

export default {
  data() {
    return {
      searchKey: ""
    };
  },
  asyncData({ store, route }) {
    store.dispatch("userListGet", { route: route });
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
    formatTime(timestamp, format = "YYYY-MM-DD HH:mm") {
      let date = new Date(timestamp * 1000);
      return Moment(date).format(format);
    },
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
      this.$router.push({ path: "/user", query: pushQuery });
      this.$store.dispatch("userListGet", { route: this.$route });
    },
    searchUser() {
      let keyword = this.searchKey;

      this.$store.dispatch("userListGet", {
        route: this.$route,
        body: { where: { keyword: keyword } }
      });
    },
    async userStatus(userId, status = 0) {
      if (!confirm(status ? "确认审核通过该用户" : "确认冻结禁用此用户")) {
        return false;
      }
      let body = { user_id: userId, status: status };
      let ret = await Request.post("/api/user/status", body);
      if (ret.code == 0) {
        let query = this.$route.query;
        let pushQuery = {};
        Object.keys(query).forEach(key => {
          pushQuery[key] = query[key];
        });
        this.$router.push({ path: "/user", query: pushQuery });
        this.$store.dispatch("userListGet", { route: this.$route });
      }
    }
  }
};
</script>
