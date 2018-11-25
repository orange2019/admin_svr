<template>
  <div class="page-news-list">

    <div class="page-news-list-top row">
      <div class="news-action col-12 text-right">
        <router-link to="/news/update" class="btn btn-outline-primary pl-4 pr-4">添加条目</router-link>
      </div>
      <div class="col-12">
        <hr>
      </div>
    </div>
    
    <div class="table-responsive">
      <table class="table table-hover ">
        <thead>
          <tr>
            <th>ID</th>
            <th>标题</th>
            <th>时间</th>
            <th>排序</th>
            <th>状态</th>
            <th class="text-right">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items">
            <td>{{item.id}}</td>
            <td class="text-truncate">{{ item.title }}</td>
            <td>{{ formatTime(item.post_time) }} </td>
            <td>{{ item.sort }}</td>
            <td>
              <span v-if="item.status == 0" class="text-danger">禁用</span>
              <span v-if="item.status == 1" class="text-success">正常</span>
            </td>
            <td class="text-right">
              <router-link :to="{ path : 'news/update' , query : {id : item.id }}" class="btn btn-outline-primary btn-sm">编辑</router-link>
              <a href="javascript:;" @click="newsDelete(item.id)" class="btn btn-outline-danger btn-sm">删除</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="page-pagination">
      <hr>
      <my-pagination :total="count" :display="size" :currentPage="currentPage" @pageChange="pageChange"></my-pagination>
    </div>
  </div>
</template>

<script>
import Request from "./../../api/common/request";
import Moment from "moment";

export default {
  data() {
    return {};
  },
  asyncData({ store, route }) {
    let query = route.query;
    // console.log("/api/news/list.query", query);
    query.page = parseInt(route.query.page) || 1
    query.limit = parseInt(route.query.limit) || store.state.listLimit || 10
    store.state.listCurrentNum = query.page
    // let searchKeyword = query.keyword || ''
    // store.state.searchKeyword = searchKeyword
    console.log("/api/news/list.query", query);

    Request.get("/api/news/list", query).then(ret => {
      console.log("request news list ret", ret);
      store.state.listItems = ret.data.list;
      store.state.listCount = ret.data.count;
    });
  },
  computed: {
    items() {
      return this.$store.state.listItems;
    },
    count() {
      return this.$store.state.listCount;
    },
    size(){
      return this.$store.state.listLimit;
    },
    currentPage(){
      return this.$store.state.listCurrentNum
    }
  },
  methods: {
    async newsDelete(newsId) {
      // console.log(this.$route)
      // console.log(this.$router)
      if (confirm("确认删除?")) {
        let ret = await Request.post("/api/news/status", {
          news_id: newsId,
          status: -1
        });
        if (ret.code == 0) {
          this.$router.go(0);
        } else {
          alert("删除失败");
        }
      }
    },
    formatTime(timestamp, format = "YYYY-MM-DD HH:mm") {
      let date = new Date(timestamp * 1000);
      return Moment(date).format(format);
    },
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
      // console.log('pageChange.query' , query)
      this.$router.push({path: '/news' , query: pushQuery })
      setTimeout(() => {
        this.$router.go(0)
      }, 0);
      // 
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {});
  }
};
</script>
