<template>
  <div class="page-user-transaction">
    <div class="row page-user-transaction-top">
      <div class="col-6">
        <h6>用户交易记录</h6>
      </div>
      <div class="col-6 text-right">
        <a href="javascript:history.go(-1);" class="btn btn-outline-primary">返回</a>
      </div>
      <div class="col-12">
        <hr>
      </div>
    </div>

    <div class="table-responsive" v-if="count">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>编号</th>
            <th>电话号码</th>
            <th>用户姓名</th>
            <th>操作类型</th>
            <th>操作时间</th>
            <th>数量</th>
            <th>消耗GAS</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items">
            <td>{{item.hash}}</td>
            <td>{{ item.user ? item.user.mobile : '' }}</td>
            <th>{{ item.user_info ? item.user_info.realname : '' }}</th>
            <th>{{ transactionTypes[item.type] }}</th>
            <td>{{ formatTime(item.create_time) }}</td>
            <td>
              <span>{{ item.num }}</span>
            </td>
            <td>{{ item.gas_used }}</td>
            <td></td>
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
  </div>
</template>

<script>
import Request from "./../../api/common/request";
import Moment from "moment";
const transactionTypes = [
  "",
  "充值",
  "提币",
  "转账",
  "产品购买",
  "产品收益",
  "团队收益",
  "资产冻结",
  "资产解冻"
];

export default {
  data() {
    return {
      transactionTypes: transactionTypes
    };
  },
  asyncData({ store, route }) {
    store.dispatch("userTransactionListGet", {
      route: route
    });
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
      this.$router.push({
        path: "/user/transaction",
        query: pushQuery
      });
      this.$store.dispatch("userTransactionListGet", {
        route: this.$route
      });
    },
    userTransactionApply(uuid) {
      if (!confirm("确认审核通过")) {
        return false;
      }
      this.$store
        .dispatch("userTransactionItemApply", {
          uuid: uuid
        })
        .then(ret => {
          if (ret.code == 0) {
            alert("操作成功");
            this.$store.dispatch("userTransactionListGet", {
              route: this.$route
            });
          } else {
            alert("操作失败:" + ret.message);
          }
        });
    }
  }
};
</script>
