<template>
<div class="page-category-list">
  <div class="page-mall-list-top row">
      <div class="mall-action col-1 text-left">
        <router-link to="category/add" class="btn btn-outline-primary pl-4 pr-4">创建分类</router-link>
      </div>
      
      <div class="col-12">
        <hr>
      </div>
    </div>
  <div class="table-responsive">
      <table class="table table-hover ">
        <thead>
          <tr>
            <th>分类ID</th>
            <th>分类名称</th>
            <th>排序</th>
            <th>状态</th>
            <th >操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items">
            <td>{{item.id}}</td>
            <td>{{item.name}}</td>
            <td>{{item.sort}}</td>
            <td>
              <span v-if="item.status == 0" class="text-success">启用</span>
              <span v-if="item.status == 1" class="text-danger">未启用</span>
            </td>
            <td >
              <router-link :to="{ path : 'category/update' , query : {id : item.id }}" class="btn btn-outline-primary btn-sm">编辑分类</router-link>
              <a v-if="item.status == 0" href="javascript:;" @click="categoryDelete(item.id)" class="btn btn-outline-danger btn-sm">不启用</a>
              <a v-if="item.status == 1" href="javascript:;" @click="categoryShelves(item.id)" class="btn btn-outline-success btn-sm">启用</a>
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

export default {
  asyncData({ store,route}){
    store.dispatch('categoryList',{route:route})
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
    async categoryDelete(id) {
      // console.log(this.$route)
      // console.log(this.$router)
      if (confirm("确认不启用?")) {
        let ret = await Request.post("/api/category/categoryModify", {
          id: id,
          status: 1
        });
        if (ret.code == 0) {
          this.$router.go(0);
        } else {
          alert("操作失败");
        }
      }
    },
     async categoryShelves(id) {
      // console.log(this.$route)
      // console.log(this.$router)
      if (confirm("确认启用?")) {
        let ret = await Request.post("/api/category/categoryModify", {
          id: id,
          status: 0
        });
        if (ret.code == 0) {
          this.$router.go(0);
        } else {
          alert("操作失败");
        }
      }
    },

  }
}
</script>

