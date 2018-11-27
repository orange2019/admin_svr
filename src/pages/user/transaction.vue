<template>
  <div class="page-user-transaction">
    <div class="page-user-transaction-top">
      <div>
        <h6>用户交易记录</h6>
      </div>

      <div class="table-responsive" v-if="count">
      <table class="table table-hover ">
        <thead>
          <tr>
            <th>编号</th>
            <th>电话号码</th>
            <th>用户姓名</th>
            <th>操作类型</th>
            <th>操作时间</th>
            <th>数量(获得/支出)</th>
            <th>积分</th>
            <th>操作</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items">
            <td>{{item.uuid}}</td>
            <td>{{ item.user.mobile }}</td>
            <th>{{ item.user_info ? item.user_info.realname : '' }} </th>
            <th>
              {{ transactionTypes[item.type] }}
            </th>
            <td>{{ formatTime(item.create_time) }} </td>
            <td>
              <span v-if="item.type == 1">{{ item.num_get }} / - </span>
              <span v-if="item.type == 2">- / {{ item.num_sent }} </span>
            </td>
            <td>
              <span v-if="item.status == 0" class="text-danger">未审核</span>
              <span v-if="item.status == 1" class="text-success">已完成</span>
            </td>
            <td>
              <span v-if="item.status == 0 && item.type == 1">
                <a href="javascript:" @click="userTransactionFinish(item.uuid , 0)" class="btn btn-outline-warning btn-sm">审核通过</a>
              </span>
            </td>
            <td>
     
            </td>
          </tr>
        </tbody>
      </table>

      <div class="page-pagination">
        <hr>
        <my-pagination :total="count" :display="size" :currentPage="currentPage" @pageChange="pageChange"></my-pagination>
      </div>

    </div>

    </div>
  </div>
</template>

<script>
import Request from "./../../api/common/request";
import Moment from "moment";
const transactionTypes = ['' , '充值' , '提币' , '积分兑换']

export default {
  data(){
    return {
      transactionTypes : transactionTypes
    }
  },
  asyncData({store,route}){
    store.dispatch("userTransactionListGet", { route: route });
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
      let query = this.$route.query;
      let pushQuery = {};
      Object.keys(query).forEach(key => {
        if (key != "page") {
          pushQuery[key] = query[key];
        }
      });
      pushQuery.page = num;
      this.$router.push({ path: "/user/transaction", query: pushQuery });
      this.$store.dispatch("userTransactionListGet", { route: this.$route });
    },
  }
}
</script>
