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
              <router-link
                :to="{path : '/user/invest' , query : {user_id : item.id}}"
                class="btn btn-outline-primary btn-sm"
              >投产信息</router-link>
              <router-link
                :to="{path : '/user/transaction' , query : {user_id : item.id}}"
                class="btn btn-outline-primary btn-sm"
              >交易记录</router-link>
              <router-link
                :to="{path : '/assets/out' , query : {user_id : item.id}}"
                class="btn btn-outline-primary btn-sm"
              >提币审核</router-link>
            </td>
            <td>
              <input type="number" v-model="frozenNum[item.id]" style="width:80px;">
              <a href="javascript:;" @click="forzen(item.id , 0)" class="btn btn-sm btn-danger">冻结</a>
            </td>
            <td>
              <input type="number" v-model="unFrozenNum[item.id]" style="width:80px;">
              <a href="javascript:;" @click="forzen(item.id , 1)" class="btn btn-sm btn-primary">解冻</a>
            </td>
            <td>
              <!-- <input type="number" v-model="assetsInNum[item.id]" style="width:80px;"> -->
              <a href="javascript:;" @click="assetsInOpen(item)" class="btn btn-sm btn-primary">充值</a>
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

    <div class="position-fixed fixed-top w-100 h-100 bg-light p-3" :style="checkBoxStyle">
      <div class="text-right">
        <a href="javascript:;" class="btn btn-outline-danger" @click="assetsInClose">关闭</a>
      </div>
      <hr>
      <div v-html="checkBoxTitle" class="h4"></div>
      <div class>
        <form class="w-50" @submit.prevent="assetsIn">
          <div class="form-group">
            <label for>输入充值数量</label>
            <div class>
              <input type="text" class="form-control" v-model="postData.num">
            </div>
          </div>
          <div class="form-group">
            <label for>输入短信验证码</label>
            <div class="row">
              <div class="col-10">
                <input type="text" class="form-control" v-model="postData.code">
              </div>
              <div class="col-2">
                <a href="javascript:;" @click="sendSms" class="btn btn-outline-primary btn-block">发送</a>
              </div>
            </div>
          </div>
          <div class="form-group">
            <input type="submit" value="确认" class="btn btn-primary">
          </div>
        </form>
        <div v-html="checkBoxMsg" class="text-danger mt-3"></div>
      </div>
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
      assetsInNum: {},
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
      },
      checkBoxStyle: {
        "padding-left": "250px !important",
        display: "none"
      },
      checkBoxTitle: "",
      checkBoxMsg: "",
      postData: {
        num: "",
        code: "",
        user_id: 0
      }
    };
  },
  asyncData({ store, route }) {
    store.state.listItems = [];
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
    assetsInClose() {
      this.checkBoxStyle.display = "none";
      this.checkBoxTitle = "";
      this.postData.user_id = item.user_id;
    },
    async assetsInOpen(item) {
      this.checkBoxStyle.display = "block";
      this.checkBoxMsg = "";
      this.checkBoxTitle = "用户 " + item.user_info.realname + " 充值";

      this.postData.user_id = item.id;
      console.log("this.postData.user_id", this.postData.user_id);
    },
    async sendSms() {
      let url = "/api/auth/verifyCode";
      let ret = await Request.post(url, {});
      console.log("sendSms ret", ret);
      if (ret.code == 0) {
        this.checkBoxMsg = "发送验证码成功";
      } else {
        this.checkBoxMsg = "发送验证码失败";
      }
    },

    async assetsIn() {
      let userId = this.postData.user_id;
      let num = this.postData.num || 0;
      let code = this.postData.code || "";
      let url = "/api/assets/in";

      if (num == 0) {
        return false;
      }

      if (!confirm("确认充值:" + num)) {
        return false;
      }

      // this.errMsg.style.display = "block";
      this.checkBoxMsg = "操作进行中...";

      let postData = {
        user_id: userId,
        num: num,
        code: code
      };

      console.log("assetsIn postData", postData);

      let ret = await Request.post(url, postData);
      if (ret.code == 0) {
        // alert("操作成功");

        this.checkBoxMsg = "操作成功";
        this.assetsInClose();
        // this.assetsInNum[userId] = "";
        this.$store.dispatch("userListGet", {
          route: this.$route
        });

        // this.errMsg.style.display = "none";
      } else {
        // alert(ret.message);
        this.checkBoxMsg = ret.message;
      }
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

      if (!confirm("确认" + (type == 0 ? "冻结" : "解冻") + num)) {
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
