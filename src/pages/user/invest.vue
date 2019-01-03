<template>
  <div class="page-user-invest">
    <div class>
      <a href="javascript:history.go(-1);" class="btn btn-outline-primary">返回</a>
      <hr>
    </div>
    <div v-if="userInvestList && userInvestList.length">
      <h6>投产信息</h6>
      <div class>
        <table class="table">
          <tr>
            <th>产品名称</th>
            <th>开始时间</th>
            <th>结束时间</th>
            <th>收益率</th>
            <th>数量</th>
            <th>天数</th>
          </tr>
          <tr v-for="item in userInvestList">
            <td>{{ item.invest.name }}</td>
            <td>{{ formatTime(item.start_time) }}</td>
            <td>{{ formatTime(item.end_time) }}</td>
            <td>{{ item.rate }} %</td>
            <td>{{ item.num }}</td>
            <td>{{ item.days }}</td>
          </tr>
        </table>
      </div>
    </div>

    <div v-else>无记录</div>
  </div>
</template>

<script>
import Moment from "moment";

export default {
  asyncData({ store, route }) {
    store.dispatch("getUserInvestList", { route: route });
  },
  computed: {
    userInvestList() {
      return this.$store.state.userInvestList;
    }
  },
  methods: {
    formatTime(timestamp, format = "YYYY-MM-DD HH:mm") {
      let date = new Date(timestamp * 1000);
      return Moment(date).format(format);
    }
  }
};
</script>

