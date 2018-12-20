<template>
  <div class="page-mall-list">

    <div class="page-mall-list-top row">
      <div class="mall-action col-12 text-right">
        <router-link to="/mall/update" class="btn btn-outline-primary pl-4 pr-4">添加商品</router-link>
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
            <th>商品名称</th>
            <th>商品信息</th>
            <th>描述</th>
            <th>价格</th>
            <th>库存</th>
            <th>图片</th>
            <th>创建时间</th>
            <th>状态</th>
            <th >操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items">
            <td>{{item.id}}</td>
            <td>{{item.name}}</td>
            <td>{{item.info}}</td>
            <td>{{item.description}}</td>
            <td>{{item.price}}</td>
            <td>{{item.stock}}</td>
            <td><img :src="item.cover"/></td>
            <td>{{formatTime(item.create_time)}}</td>
            <td>
              <span v-if="item.status == 0" class="text-danger">下架</span>
              <span v-if="item.status == 1" class="text-success">上架</span>
            </td>
            <td >
              <router-link :to="{ path : 'news/update' , query : {id : item.id }}" class="btn btn-outline-primary btn-sm">编辑商品</router-link>
              <a href="javascript:;" @click="newsDelete(item.id)" class="btn btn-outline-danger btn-sm">下架商品</a>
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
    store.dispatch('goodList' , {route : route})
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
      this.$router.push({path: '/mall' , query: pushQuery })
      this.$store.dispatch('goodList' , {route : this.$route})
      // setTimeout(() => {
      //   this.$router.go(0)
      // }, 0);
      // 
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {});
  }
};
</script>
