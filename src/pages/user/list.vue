<template>
  <div class="page-user-list">
    <div class="page-user-list-top row">
      <div class="col-3">
        <input type="text" v-model="searchKey" class="form-control" placeholder="输入手机号码">
      </div>
      <div class="col-3">
        <a href="javascript:" class="btn btn-sm" @click="searchUser">搜索</a>
      </div>
      <div class="col-3 text-right">
        <router-link to="/user/addresslist" class="btn btn-outline-primary">用户地址列表</router-link>
      </div>
      <div class="col-3 text-right">
        <router-link to="/user/relation" class="btn btn-outline-primary">用户关系列表</router-link>
      </div>
      <div class="col-12">
        <hr>
      </div>
    </div>

    <div>
      <ul class="nav">
        <li class="nav-item">
          <a class="nav-link" :class="navLink[0]" href="javascript:;" @click="chooseUser(0)">全部</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" :class="navLink[1]" href="javascript:;" @click="chooseUser(1)">已审核</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" :class="navLink[2]" href="javascript:;" @click="chooseUser(2)">未审核</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" :class="navLink[3]" href="javascript:;" @click="chooseUser(3)">资料未上传</a>
        </li>
      </ul>
    </div>
    <div class="table-responsive mt-3" v-if="count">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>USERID</th>
            <th></th>
            <th>电话号码</th>
            <th>真实姓名</th>
            <th>钱包地址</th>
            <th>注册时间</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items">
            <td>{{item.id}}</td>
            <td>
              <img
                v-if="item.user_info && item.user_info.avatar"
                :src="item.user_info.avatar"
                width="24"
                height="24"
                class="rounded-circle"
              >
            </td>
            <td>{{ item.mobile }}</td>
            <td>{{ item.user_info ? item.user_info.realname : '' }}</td>
            <th>{{ item.wallet_address }}</th>

            <td>{{ formatTime(item.create_time) }}</td>
            <td>
              <span v-if="item.status == 0" class="text-danger">禁用</span>
              <span v-if="item.status == 1" class="text-success">正常</span>
            </td>
            <td>
              <span v-if="item.status == 1">
                <a
                  href="javascript:"
                  @click="userStatus(item.id , 0)"
                  class="btn btn-outline-warning btn-sm"
                >冻结用户</a>
              </span>
              <span v-if="item.status == 0">
                <a
                  href="javascript:"
                  @click="userStatus(item.id , 1)"
                  class="btn btn-outline-success btn-sm"
                >审核通过</a>
              </span>
              <span class="ml-1">
                <a
                  class="btn btn-primary btn-sm"
                  href="javascript:;"
                  @click="viewUserDetail(item)"
                >查看详情</a>
              </span>
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

      <my-modal :title="modalTitle" :isOpen="modalIsOpen" @closeModalAction="closeModalAction">
        <div>
          <ul class="list-group">
            <li class="list-group-item d-block">
              <span class="w-25 d-inline-block">手机号:</span>
              <span class="w-50 d-inline-block">{{ userDetail.mobile || '' }}</span>
            </li>
            <li class="list-group-item d-block">
              <span class="w-25 d-inline-block">钱包地址:</span>
              <span class="w-50 d-inline-block">{{ userDetail.wallet_address || '' }}</span>
            </li>
            <li class="list-group-item d-block">
              <span class="w-25 d-inline-block">真实姓名:</span>
              <span
                class="w-50 d-inline-block"
              >{{ userDetail.user_info ? userDetail.user_info.realname : '' }}</span>
            </li>
            <!-- <li class="list-group-item d-block">
              <span class="w-25 d-inline-block">出生年月:</span>
              <span
                class="w-50 d-inline-block"
              >{{ userDetail.user_info ? formatTime(userDetail.user_info.birth) : '' }}</span>
            </li>-->
            <li class="list-group-item d-block">
              <span class="w-25 d-inline-block">身份证号:</span>
              <span
                class="w-50 d-inline-block"
              >{{ userDetail.user_info ? userDetail.user_info.idcard_no : '' }}</span>
            </li>
            <li class="list-group-item d-block">
              <span class="w-25 d-inline-block">身份证正面:</span>
              <span class="w-50 d-inline-block">
                <img
                  :src="userDetail.user_info.idcard_positive"
                  alt
                  v-if=" userDetail.user_info &&  userDetail.user_info.idcard_positive"
                  width="100%"
                >
              </span>
            </li>
            <li class="list-group-item d-block">
              <span class="w-25 d-inline-block">身份证反面:</span>
              <span class="w-50 d-inline-block">
                <img
                  :src="userDetail.user_info.idcard_reverse"
                  alt
                  v-if=" userDetail.user_info &&  userDetail.user_info.idcard_reverse"
                  width="100%"
                >
              </span>
            </li>
          </ul>
        </div>
      </my-modal>
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
      searchKey: "",
      modalTitle: "用户信息",
      modalIsOpen: 0,
      userDetail: {},
      navLink: [
        { disabled: true },
        { disabled: false },
        { disabled: false },
        { disabled: false }
      ]
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
      console.log("pageChange.pushQuery", pushQuery);
      this.$router.push({
        path: "/user",
        query: pushQuery
      });
      this.$store.dispatch("userListGet", {
        route: this.$route,
        body: { where: where }
      });
    },
    searchUser() {
      let keyword = this.searchKey;

      // this.$store.dispatch("userListGet", {
      //   route: this.$route,
      //   body: { where: { keyword: keyword } }
      // });

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
    chooseUser(type = 0) {
      let where = {};
      if (type == 1) {
        where.status = 1;
        this.$router.push({ path: "/user", query: { status: 1, page: 1 } });
      } else if (type == 2) {
        where.status = 0;
        where.audit = 1;

        this.$router.push({
          path: "/user",
          query: { status: 0, audit: 1, page: 1 }
        });
      } else if (type == 3) {
        where.status = 0;
        where.audit = 0;
        this.$router.push({
          path: "/user",
          query: { audit: 0, status: 0, page: 1 }
        });
      } else {
        this.$router.push({ path: "/user", query: { page: 1 } });
      }

      // this.$store.state.listCurrentNum = 1;
      // this.$store.dispatch("userListGet", {
      //   route: this.$route,
      //   body: { where: where }
      // });
      this.setNavLink(type);
      this.pageChange(1, where);
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

      console.log("user item", item);
      this.userDetail = item;
    },
    closeModalAction() {
      this.modalIsOpen = 0;
    }
  }
};
</script>
