<template>
  <div class="page-category-update">
    <div class="row">
      <div class="col-6 text-left">
        <h4>订单详情</h4>
      </div>
      <div class="col-6 text-right">
        <a href="javascript:history.go(-1)" class="btn btn-outline-primary">返回</a>
      </div>
      <div class="col-12">
        <hr>
      </div>
    </div>
    <form @submit.prevent="categoryUpdateSubmit()" class="form">
    <div class="form-group row">
      <label for class="col-form-label col-2">分类名称</label>
      <div class="col-10">
        <input
          type="text"
          class="form-control"
          placeholder="请输入分类名称"
          v-model="categoryData.name"
        >
      </div>
    </div>
    <div class="form-group row">
      <label for class="col-form-label col-2">分类排序</label>
      <div class="col-10">
        <input
          type="text"
          class="form-control"
          placeholder="请输入分类排序"
          v-model="categoryData.sort"
        >
      </div>
    </div>
    <div class="form-group row">
        <div class="col-12 text-right">
          <hr>
          <input type="hidden" v-model="categoryData.id">
          <input type="submit" value="更新分类信息" class="btn btn-success pl-5 pr-5">
        </div>
    </div>
  </form>
  </div>
</template>
<script>
import Request from "./../../api/common/request";
export default {
  asyncData({ store, route }) {
    console.log("page init............");
    let categoryId = route.query.id || 0;
    if (categoryId) {
      Request.post("/api/category/categoryDetail", { id: categoryId }).then(ret => {
        console.log("request category detail", ret);
        store.state.categoryData = ret.data;
      });
    } else {
      store.state.categoryData = {
        id: "",
        pid: "",
        name: "",
        status: 0,
        sort: 0
      };
    }
  },
  computed: {
    categoryData() {
      return this.$store.state.categoryData;
    }
  },
  methods: {
      async categoryUpdateSubmit(){
        let categoryData = this.categoryData;
        console.log("orderUpdateSubmit().categoryData", categoryData);
         
        let ret = await Request.post("/api/category/categoryModify", categoryData);
        console.log("categoryUpdateSubmit().categoryData ret", ret);
        if (ret.code === 0) {
          // location.href = '/'
          alert("提交成功");
          this.$router.go(-1);
        } else {
          alert("提交失败:" + ret.message);
        }
      },

  },

}
</script>
