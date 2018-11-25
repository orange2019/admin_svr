<template>
  <div v-if="adminInfo" class="page">
    <div class="page-left">
      <div class="page-brand">
        卡西慕后台管理
      </div>

      <div class="page-left-navs">
        <ul class="">
          <li class="" v-for="nav in navs">
            <router-link :to="nav.url" >{{nav.name}}</router-link>
          </li>
        </ul>
      </div>
    </div>

    <div class="page-right">

      <div class="page-right-top text-right">
        <span>{{ adminInfo.email }}</span>
        <span> | </span>
        <a href="javascript:;" @click="logout">退出</a>
      </div>

      <div class="page-right-content">
        <transition name="fade">
          <router-view v-if="isRouterAlive"></router-view>
        </transition>
        
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
  provide(){
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      // admin : this.$store.state.admin
      isRouterAlive : true
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
          name: '资产数据',
          url: '/assets',
          type: 0
        },
        {
          name : '商城管理',
          url: '/mall',
          type: 2
        },
        {
          name : '新闻资讯',
          url: '/news',
          type: 0
        },
        {
          name : '系统设置',
          url: '/config',
          type: 0
        },
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
    },
    reload(){
      console.log('page reload ....')
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    }
  }
}
</script>


