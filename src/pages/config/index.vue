<template>
  <div class="page-config">
    <ul class="nav">
      <li class="nav-item">
        <a class="nav-link disabled" href="javascript:;">系统设置</a>
      </li>
      <li class="nav-item">
        <router-link to="/invest" class="nav-link">投产管理</router-link>
      </li>
    </ul>
    <hr>
    <div class="mt-3">
      <form @submit.prevent="configSubmit('rateLevel')">
        <div class="form-group row">
          <label for class="col-12 col-form-label">子集收益率规律(百分比数字，| 分隔)</label>
          <div class="col-10">
            <input type="text" class="form-control" placeholder v-model="config.rateLevel">
          </div>
          <div class="col-2">
            <input type="submit" class="btn btn-primary btm-sm btn-block" value="设置">
          </div>
        </div>
      </form>
      <hr>
    </div>
  </div>
</template>

<script>
export default {
  asyncData({ store, route }) {
    store.dispatch("configGet", { name: "rateLevel" });
    // store.dispatch("configGet", { name: "investList" });
  },
  computed: {
    config() {
      return this.$store.state.config;
    }
    // configRateLevel(){

    // },
    // configInvestList(){
    //   return this.$store.state.config.investList
    // }
  },
  methods: {
    investConfigAdd() {
      let list = this.$store.state.config.investList;
      list.push({
        num: "",
        days: "",
        rate: ""
      });
      this.$store.state.config.investList = list.sort((x, y) => {
        return x["num"] - y["num"];
      });
    },
    investConfigDelete(id) {
      console.log("investConfigDelete key", id);
      let list = this.$store.state.config.investList;
      delete list[id];
      let newList = [];
      list.forEach(element => {
        if (element) {
          newList.push(element);
        }
      });
      this.$store.state.config.investList = newList.sort((x, y) => {
        return x["num"] - y["num"];
      });
    },
    configSubmit(key) {
      this.$store.dispatch("configSubmit", { name: key });
    }
  }
};
</script>
