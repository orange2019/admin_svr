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
            <th>用户Id</th>
            <th>电话号码</th>
            <th>姓名</th>
            <th>钱包地址</th>
            <th>可用资产</th>
            <th>冻结资产</th>
            <th>状态</th>
            <th>操作</th>
            <th>冻结资产</th>
            <th>解冻资产</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items">
            <td>{{ item.id }}</td>
            <td>{{ item.mobile }}</td>
            <td>{{item.user_info ? item.user_info.realname : ''}}</td>
            <th>{{ item.wallet_address }}</th>
            <th>
              <a href="javascript:;" @click="checkUserTokenBalance(item.wallet_address)">查看</a>
            </th>
            <th>{{ item.user_asset ? item.user_asset.token_num_backup : 0 }}</th>
            <td>
              <span v-if="item.status == 0" class="text-danger">禁用</span>
              <span v-if="item.status == 1" class="text-success">正常</span>
            </td>
            <td>
              <router-link :to="{path : '/user/invest' , query : {user_id : item.id}}">投产信息</router-link>
            </td>
            <td>
              <input type="number" v-model="frozenNum[item.id]" style="width:100px;">
              <a href="javascript:;" @click="forzen(item.id , 0)" class="btn btn-sm btn-danger">冻结</a>
            </td>
            <td>
              <input type="number" v-model="unFrozenNum[item.id]" style="width:100px;">
              <a href="javascript:;" @click="forzen(item.id , 1)" class="btn btn-sm btn-primary">解冻</a>
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

    <div class="bg" :style="errMsg.style">
      <div class v-html="errMsg.text" :style="errMsg.textStyle"></div>
    </div>
  </div>
</template>

<script>
import Request from "./../../api/common/request";
import Moment from "moment";

export default {
  data() {
    return {
      searchKey: "",
      frozenNum: {},
      unFrozenNum: {},
      errMsg: {
        text: "",
        style: {
          position: "fixed",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          "z-index": 100000,
          display: "none",
          background: "none"
        },
        textStyle: {
          width: "300px",
          margin: "100px auto",
          background: "#000",
          padding: "1rem",
          color: "#fff",
          "text-align": "center"
        }
      }
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
      this.$router.push({ path: "/user/assets", query: pushQuery });
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
    },
    async checkUserTokenBalance(address) {
      let body = { address: address };
      let ret = await Request.post("/api/user/getTokenBalance", body);
      console.log(ret);
      alert(ret.data.tokenBalance);
    },
    async forzen(userId, type = 0) {
      let num = 0;
      let url = "";
      if (type == 0) {
        num = this.frozenNum[userId] || 0;
        url = "/api/assets/frozen";
      } else {
        num = this.unFrozenNum[userId] || 0;
        url = "/api/assets/unFrozen";
      }

      if (num == 0) {
        return false;
      }

      this.errMsg.style.display = "block";
      this.errMsg.text = "操作进行中...";

      let postData = {
        user_id: userId,
        num: num
      };

      console.log("forzen postData", postData);

      let ret = await Request.post(url, postData);
      if (ret.code == 0) {
        // alert("操作成功");

        this.errMsg.text = "操作成功";
        this.frozenNum[userId] = "";
        this.unFrozenNum[userId] = "";
        this.$store.dispatch("userListGet", {
          route: this.$route
        });

        this.errMsg.style.display = "none";
      } else {
        // alert(ret.message);
        this.errMsg.text = ret.message;

        setTimeout(() => {
          this.errMsg.style.display = "none";
        }, 1500);
      }
    }
  }
};
</script>
