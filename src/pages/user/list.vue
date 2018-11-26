<template>
  <div class="page-user-list">

    <div class="page-user-list-top row">
      <div class="col-3">
        <input type="text" v-model="searchKey" class="form-control" placeholder="输入手机号码">
      </div>
      <div class="col-1">
        <a href="javascript:" class="btn btn-sm" @click="searchUser">搜索</a>
      </div>

      <div class="col-12">
        <hr>
      </div>
    </div>
    
    <div class="table-responsive" v-if="count">
      <table class="table table-hover ">
        <thead>
          <tr>
            <th>USERID</th>
            <th>电话号码</th>
            <th>FOD_TOKEN</th>
            <th>资产(总计|可用/冻结)</th>
            <th>注册时间</th>
            <th>状态</th>
            <th>操作</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items">
            <td>{{item.id}}</td>
            <td>{{ item.mobile }}</td>
            <th>{{ item.fod_token }} </th>
            <th>
              <span>{{ item.user_asset ? (item.user_asset.fod_num + item.user_asset.fod_num_frozen) : 0}}</span> | 
              <span>{{ item.user_asset ? item.user_asset.fod_num  : 0}}</span> / 
              <span>{{ item.user_asset ? item.user_asset.fod_num_frozen  : 0}}</span> 
            </th>
            <td>{{ formatTime(item.create_time) }} </td>
            <td>
              <span v-if="item.status == 0" class="text-danger">禁用</span>
              <span v-if="item.status == 1" class="text-success">正常</span>
            </td>
            <td>
              <span v-if="item.status == 1">
                <a href="javascript:" @click="userStatus(item.id , 0)" class="btn btn-outline-warning btn-sm">冻结用户</a>
              </span>
              <span v-if="item.status == 0">
                <a href="javascript:" @click="userStatus(item.id , 1)" class="btn btn-outline-success btn-sm">审核通过</a>
              </span>
              <span class="ml-1">
                <a class="btn btn-primary btn-sm" href="javascript:;" @click="viewUserDetail(item)">查看详情</a>
              </span>
            </td>
            <td>
              <router-link :to="{path : '/user/invest' , query : {user_id : item.id}}" class="btn btn-link" >投产信息</router-link>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="page-pagination">
        <hr>
        <my-pagination :total="count" :display="size" :currentPage="currentPage" @pageChange="pageChange"></my-pagination>
      </div>

      <my-modal :title="modalTitle" :isOpen="modalIsOpen" @closeModalAction="closeModalAction">
        <div>
          <ul class="list-group">
          <li class="list-group-item d-block">
            <span class="w-25 d-inline-block">手机号:</span> 
            <span class="w-50 d-inline-block">{{ userDetail.mobile || '' }} </span>
          </li>
          <li class="list-group-item d-block">
            <span class="w-25 d-inline-block">FOD_TOKEN:</span> 
            <span class="w-50 d-inline-block">{{ userDetail.fod_token || '' }} </span>
          </li>
          <li class="list-group-item d-block">
            <span class="w-25 d-inline-block">真实姓名:</span> 
            <span class="w-50 d-inline-block">{{ userDetail.user_info ? userDetail.user_info.realname : '' }} </span>
          </li>
          <li class="list-group-item d-block">
            <span class="w-25 d-inline-block">出生年月:</span> 
            <span class="w-50 d-inline-block">{{ userDetail.user_info ? formatTime(userDetail.user_info.birth) : '' }} </span>
          </li>
          <li class="list-group-item d-block">
            <span class="w-25 d-inline-block">身份证号:</span> 
            <span class="w-50 d-inline-block">{{ userDetail.user_info ? userDetail.user_info.idcard_no : '' }} </span>
          </li>
          <li class="list-group-item d-block">
            <span class="w-25 d-inline-block">身份证正面:</span> 
            <span class="w-50 d-inline-block">
              <img :src="userDetail.user_info.idcard_positive" alt="" v-if=" userDetail.user_info &&  userDetail.user_info.idcard_positive" width="100%">
            </span>
          </li>
          <li class="list-group-item d-block">
            <span class="w-25 d-inline-block">身份证反面:</span> 
            <span class="w-50 d-inline-block">
              <img :src="userDetail.user_info.idcard_reverse" alt="" v-if=" userDetail.user_info &&  userDetail.user_info.idcard_reverse" width="100%">
            </span>
          </li>
        </ul>
        </div>
      </my-modal>
    </div>
    <div v-else>
      <p class="text-center"> 无数据 </p>
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
      modalTitle: "用户信息",
      modalIsOpen: 0,
      userDetail: {}
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
    },
    viewUserDetail(item) {
      this.modalIsOpen = 1;
      this.userDetail = item;
    },
    closeModalAction() {
      this.modalIsOpen = 0;
    }
  }
};
</script>
