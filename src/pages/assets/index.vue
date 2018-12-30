<template>
  <div class>
    <div class>
      <h3>主账户详情</h3>
      <p class="mt-3">
        fod币数量:
        <strong class="text-warning">{{ tokenInfo.balance}}</strong>
      </p>
      <p>
        代币剩余数:
        <strong class="text-danger">{{ tokenInfo.tokenBalance / 100000000 }}</strong>
      </p>
    </div>

    <hr>

    <div>
      <p>
        <router-link to="/user/assets" class="btn btn-outline-primary">用户资产列表</router-link>
        <router-link to="/user/transaction" class="btn btn-outline-primary">资产交易数据</router-link>
        <router-link to="/assets/out" class="btn btn-outline-primary">用户提币审核</router-link>
      </p>
    </div>

    <div class="mt-5" v-if="adminInfo.type == 0">
      <h3>
        测试充值代币
        <small class="text-danger">测试用，慎点</small>
      </h3>
      <div class="w-50">
        <form @submit.prevent="userAssetsInSubmit">
          <div class="form-group">
            <label for>充值金额</label>
            <div class>
              <input type="number" class="form-control" v-model="postData.num" required>
            </div>
          </div>
          <div class="form-group">
            <label for>地址</label>
            <div class>
              <textarea cols="30" rows="2" class="form-control" v-model="postData.address" required></textarea>
            </div>
          </div>

          <div class="form-group">
            <input type="submit" class="btn btn-primary" value="提交">
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Request from "./../../api/common/request.js";

export default {
  asyncData({ store, route }) {
    store.dispatch("assetsTokenInfoGet");
  },
  data() {
    return {
      postData: {
        num: "",
        address: ""
      }
    };
  },
  computed: {
    tokenInfo() {
      return this.$store.state.tokenInfo;
    },
    adminInfo() {
      return this.$store.state.admin;
    }
  },
  methods: {
    async userAssetsInSubmit() {
      let ret = await Request.post("/api/assets/inByAddress", this.postData);
      console.log(ret);
      if (ret.code == 0) {
        alert("操作成功");
        this.$store.dispatch("assetsTokenInfoGet");
      } else {
        alert("操作失败");
      }
    }
  }
};
</script>

<style>
</style>
