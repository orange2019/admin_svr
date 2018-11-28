<template>
<div>
  <h1>欢迎使用！！！</h1>
  <h3>卡西慕后台管理系统</h3>
</div>
</template>

<script>
export default {
  data() {
    return {
      
    }
  },
  computed: {
    username () {
  
    },
    getCount() {
      
    }
  },
  methods: {
    goBack () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/')
    }
  }
}
</script>


