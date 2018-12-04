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
        <router-link to="/user/assets">用户资产列表</router-link>
      </p>
      <p>
        <router-link to="/user/transaction">资产交易数据</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  asyncData({ store, route }) {
    store.dispatch("assetsTokenInfoGet");
  },
  computed: {
    tokenInfo() {
      return this.$store.state.tokenInfo;
    }
  }
};
</script>

<style>
</style>
