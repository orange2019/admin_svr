<template>
  <div class="page-user-invest">
    <div class="">
      <a href="javascript:history.go(-1);" class="btn btn-outline-primary">返回</a>
      <hr>
    </div>
    <div v-if="userInvestInfo && userInvestInfo.length">
   
      <h6>投产信息</h6>
      <div class="">
        <table class="table">
          <tr>
            <th>开始时间</th>
            <th>结束时间</th>
            <th>数量</th>
            <th>收益率</th>
            <th>天数</th>
          </tr>
          <tr v-for="item in userInvestInfo">
            <td>{{ formatTime(item.st) }}</td>
            <td>{{ formatTime(item.et) }}</td>
            <td>{{ item.rate }}</td>
            <td>{{ item.num }}</td>
            <td>{{ item.days }}</td>
          </tr>

        </table>
      </div>
      <hr>
      <h6>投产收益记录</h6>

      <div>
        <ul v-if="userInvestLogs && userInvestLogs.length" class="list-group">
          <li v-for="item in userInvestLogs" class="list-group-item">
            {{ item.log_date }} - {{ item.num }} ( 解冻资金: {{ item.num_frozen}} + 自收益: {{ item.num_self }} + 下线收益: {{ item.num_child }})
          </li>
        </ul>

      </div>
    </div>

    <div v-else>
      无记录
    </div>
    
  </div>
</template>

<script>
import Request from "./../../api/common/request";
import Moment from "moment";

export default {
  asyncData({store, route}){
    let userId = route.query.user_id
    Request.get('/api/user/investInfoAndLogs' , {user_id: userId}).then(ret => {
      console.log('request user invest data ret' , ret)
      store.state.userInvestInfo = ret.data.info
      store.state.userInvestLogs = ret.data.logs
    })

    
  },
  computed: {
    userInvestInfo(){
      return this.$store.state.userInvestInfo
    },
    userInvestLogs(){
      return this.$store.state.userInvestLogs
    }
  },
  methods: {
    formatTime(timestamp, format = "YYYY-MM-DD HH:mm") {
      let date = new Date(timestamp * 1000);
      return Moment(date).format(format);
    }
  }
}
</script>

