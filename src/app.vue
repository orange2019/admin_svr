<template>
  <div v-if="adminInfo" class="page">
    <div class="page-left">
      <div class="page-brand">卡西慕后台管理</div>

      <div class="page-left-navs">
        <ul class>
          <li class v-for="nav in navs">
            <template v-if="nav.type == 0 || nav.type == adminInfo.type || adminInfo.type == 0">
              <router-link :to="nav.url">{{nav.name}}</router-link>
            </template>
          </li>
        </ul>
      </div>
    </div>

    <div class="page-right">
      <div class="page-right-top text-right">
        <router-link to="/manager">{{ adminInfo.email }}</router-link>
        <span>|</span>
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
import Reqeust from "./api/common/request";
export default {
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      // admin : this.$store.state.admin
      isRouterAlive: true
    };
  },
  computed: {
    adminInfo() {
      if (!this.$store.state.admin && this.$route.path != "/login") {
        return (location.href = "/login");
      }
      return this.$store.state.admin;
    },
    navs() {
      return [
        {
          name: "Dashboard",
          url: "/",
          type: 0
        },
        {
          name: "用户管理",
          url: "/user",
          type: 0
        },
        {
          name: "资产管理",
          url: "/assets",
          type: 1
        },
        {
          name: "商城管理",
          url: "/mall",
          type: 2
        },
        {
          name: "新闻资讯",
          url: "/news",
          type: 0
        },
        {
          name: "配置管理",
          url: "/config",
          type: 1
        }
      ];
    }
  },
  methods: {
    async logout() {
      if (confirm("确认退出")) {
        let ret = await Reqeust.post("/api/auth/logout");
        console.log("request /api/auth/logout ret", ret);
        this.$store.state.admin = null;
      }

      // location.href = '/login'
    },
    reload() {
      console.log("page reload ....");
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      });
    }
  }
};
</script>


