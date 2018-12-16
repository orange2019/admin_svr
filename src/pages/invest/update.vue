<template>
  <div class="page-config">
    <ul class="nav">
      <li class="nav-item">
        <router-link to="/config" class="nav-link">系统设置</router-link>
      </li>
      <li class="nav-item">
        <router-link to="/invest" class="nav-link">投产管理</router-link>
      </li>
    </ul>
    <hr>
    <div class="table-responsive w-50 p-3">
      <h6>添加/编辑产品信息</h6>
      <hr>
      <form @submit.prevent="investUpdateSubmit">
        <div class="form-group">
          <label for>名称</label>
          <div>
            <input
              type="text"
              class="form-control"
              placeholder="输入名称"
              v-model="investDetail.name"
              required
            >
          </div>
        </div>

        <div class="form-group">
          <label for>数量</label>
          <div>
            <input
              type="number"
              class="form-control"
              placeholder="输入数量"
              v-model="investDetail.num"
              required
            >
          </div>
        </div>

        <div class="form-group">
          <label for>收益率</label>
          <div>
            <input
              type="text"
              class="form-control"
              placeholder="输入收益率，单位 %"
              v-model="investDetail.rate"
              required
            >
          </div>
        </div>

        <div class="form-group">
          <label for>天数</label>
          <div>
            <input
              type="number"
              class="form-control"
              placeholder="输入天数"
              v-model="investDetail.days"
              required
            >
          </div>
        </div>

        <div class="form-group">
          <label for>排序</label>
          <div>
            <input
              type="number"
              class="form-control"
              placeholder="输入排序数字，越小越优先"
              v-model="investDetail.sort"
              required
            >
          </div>
        </div>

        <div class="form-group">
          <hr>
          <input type="hidden" v-model="investDetail.id">
          <input type="submit" class="btn btn-primary pl-3 pr-3" value="提交">
          <input type="reset" class="btn btn-warning pl-3 pr-3" value="重置">
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Request from "./../../api/common/request.js";

export default {
  asyncData({ store, route }) {
    store.dispatch("investDetailGet", { route: route }).then(ret => {
      console.log(ret);
    });
  },
  data() {
    return {};
  },
  computed: {
    investDetail() {
      return this.$store.state.investDetail;
    }
  },
  methods: {
    async investUpdateSubmit() {
      let postData = this.investDetail;
      console.log(postData);
      let ret = await Request.post("/api/invest/update", postData);
      if (ret.code == 0) {
        this.$router.push({ path: "/invest" });
      } else {
        alert("操作失败");
      }
    }
  }
};
</script>
