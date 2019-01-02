<template>
  <div class="page-user-address-list">
    <div class="table-responsive">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>用户ID</th>
            <th>真实姓名</th>
            <th>地址</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items">
            <td>{{item.user_id}}</td>
            <td>{{item.realname}}</td>
            <td>
              <p v-for=" addr in item.address">
                联系人:{{addr.name}}
                联系方式:{{addr.mobile}}
                地址:{{addr.info}}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
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
</template>
<script>
import Request from "./../../api/common/request";

export default {
  data() {
    return {};
  },
  asyncData({ store, route }) {
    store.dispatch("addressList", { route: route });
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
    pageChange(num){
      // this.$store.state.listCurrentNum = num
      let query = this.$route.query
      let pushQuery = {}
      Object.keys(query).forEach(key => {
        if(key != 'page'){
          pushQuery[key] = query[key]
        }
        
      })
      pushQuery.page = num
      console.log('pageChange.query' , query)
      this.$router.push({path: '/user/addresslist' , query: pushQuery })
      this.$store.dispatch('addressList' , {route : this.$route})
    },
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {});
  },
};
</script>

