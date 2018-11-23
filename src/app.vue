<template>
  <div v-if="adminInfo" class="page">
    <div class="page-left">

    </div>

    <div class="page-right">

      <div class="page-right-top text-right">
        <span>{{ adminInfo.email }}</span>
        <span> | </span>
        <a href="javascript:;" @click="logout">退出</a>
      </div>

      <div class="page-right-content">
        <router-view></router-view>
      </div>
      

    </div>
    
  </div>
  <div v-else>
    <router-view></router-view>
  </div>
  
</template>
<script>

import Reqeust from './api/common/request'
export default {
 
  data() {
    return {
      // admin : this.$store.state.admin
    }
  },
  computed: {
    adminInfo() {
      if(!this.$store.state.admin && this.$route.path != '/login'){
        return location.href = '/login'
      }
      return this.$store.state.admin
    },
    navs(){
      return [
        {
          name : '首页',
          url: '/',
          type: 0
        },
        {
          name: '用户管理',
          url: '/user',
          type: 0
        },
        {
          name : '商城管理',
          url: '/mall',
          type: 2
        }
      ]
    }
  },
  methods: {
    async logout() {
      if(confirm('确认退出')){
        let ret = await Reqeust.post('/api/auth/logout')
        console.log('request /api/auth/logout ret' , ret)
        this.$store.state.admin = null
      }
      
      // location.href = '/login'
    }
  }
}
</script>


