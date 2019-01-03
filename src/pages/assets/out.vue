<template>
  <div>
    <div class="table-responsive mt-3" v-if="count">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>姓名</th>
            <th>手机号</th>
            <th>提交时间</th>
            <th>数量</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items">
            <td>{{ item.user_info ? item.user_info.realname : '' }}</td>
            <td>{{ item.mobile ? item.mobile : '' }}</td>
            <td>{{ formatTime(item.create_time) }}</td>
            <td>{{ item.num }}</td>
            <td>
              <span v-if="item.status == 0" class="text-danger">未审核</span>
              <span v-if="item.status == 1" class="text-success">已提币</span>
              <span v-if="item.status == 2" class="text-muted">审核不通过</span>
            </td>
            <td>
              <span v-if="item.status == 0">
                <a
                  href="javascript:"
                  class="btn btn-success btn-sm"
                  @click="itemCheckYes(item)"
                >审核通过</a>
                <a href="javascript:" class="btn btn-danger btn-sm" @click="itemCheckNo(item)">审核不通过</a>
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
    </div>
    <div v-else>
      <p class="text-center">无数据</p>
    </div>

    <div class="position-fixed fixed-top w-100 h-100 bg-light p-3" :style="checkBoxStyle">
      <div class="text-right">
        <a href="javascript:;" class="btn btn-outline-danger" @click="checkBoxClose">关闭</a>
      </div>
      <hr>
      <div v-html="checkBoxTitle" class="h4"></div>
      <div class>
        <form class="w-50" @submit.prevent="itemCheckNoSubmit">
          <div class="form-group">
            <label for>审核不通过理由</label>
            <div class>
              <textarea cols="3" class="form-control" v-model="postData.remark" required></textarea>
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
  asyncData({ store, route }) {
    store.dispatch("assetsOutListGet", { route: route, body: {} });
  },
  data() {
    return {
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
        assets_out_id: 0,
        remark: ""
      }
    };
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
      this.$store.dispatch("assetsOutListGet", {
        route: this.$route,
        body: { where: where }
      });
    },
    checkBoxClose() {
      this.checkBoxStyle.display = "none";
      this.postData.assets_out_id = 0;
      this.checkBoxTitle = "";
    },
    itemCheckNo(item) {
      this.postData.remark = "";
      this.postData.assets_out_id = item.id;
      this.checkBoxStyle.display = "block";
      this.checkBoxMsg = "";
      this.checkBoxTitle =
        "用户 " + item.user_info.realname + " 申请提币,数量:" + item.num;
    },
    async itemCheckNoSubmit() {
      let postData = this.postData;
      this.checkBoxMsg = "提交操作中...";
      let ret = await Request.post("/api/assets/outFail", postData);
      if (ret.code == 0) {
        this.$store.dispatch("assetsOutListGet", {
          route: this.$route
        });

        this.checkBoxMsg = "操作成功";
        this.checkBoxClose();
      } else {
        this.checkBoxMsg = ret.message;
      }
    },
    async itemCheckYes(item) {
      if (!confirm("确认审核通过")) {
        return;
      }

      this.errMsg.style.display = "block";
      this.errMsg.text = "操作进行中...";

      let postData = {
        assets_out_id: item.id
      };

      console.log("assetsIn postData", postData);
      let url = "/api/assets/outSuccess";
      let ret = await Request.post(url, postData);
      if (ret.code == 0) {
        // alert("操作成功");

        this.errMsg.text = "操作成功";
        this.$store.dispatch("assetsOutListGet", {
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
