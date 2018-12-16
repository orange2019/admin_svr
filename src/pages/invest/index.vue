<template>
  <div class="page-config">
    <ul class="nav">
      <li class="nav-item">
        <router-link to="/config" class="nav-link">系统设置</router-link>
      </li>
      <li class="nav-item">
        <a class="nav-link disabled" href="javascript:;">投产管理</a>
      </li>
    </ul>
    <hr>
    <div>
      <router-link to="/invest/update" class="btn btn-primary">添加投产产品</router-link>
    </div>
    <div class="table-responsive mt-3">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>产品名称</th>
            <th>收益率</th>
            <th>天数</th>
            <th>排序</th>
            <th>状态</th>
            <th class="text-right">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items">
            <td>{{item.id}}</td>
            <td class="text-truncate">{{ item.name }}</td>
            <td>{{ item.rate }} %</td>
            <td>{{ item.days }}</td>
            <td>{{ item.sort }}</td>
            <td>
              <span v-if="item.status == 0" class="text-danger">下架</span>
              <span v-if="item.status == 1" class="text-success">正常</span>
            </td>
            <td class="text-right">
              <a
                v-if="item.status == 0"
                class="btn btn-success btn-sm"
                @click="setStatus(item.id , 1)"
              >上架</a>
              <a
                v-if="item.status == 1"
                class="btn btn-danger btn-sm"
                @click="setStatus(item.id , 0)"
              >下架</a>

              <router-link
                :to="{ path : 'invest/update' , query : {id : item.id }}"
                class="btn btn-outline-primary btn-sm"
              >编辑</router-link>
              <a
                href="javascript:;"
                @click="investDelete(item.id)"
                class="btn btn-outline-danger btn-sm"
              >删除</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Request from "./../../api/common/request.js";

export default {
  asyncData({ store, route }) {
    store.dispatch("investListGet", { route });
  },
  computed: {
    items() {
      return this.$store.state.investList || [];
    }
  },
  methods: {
    async setStatus(itemId, status = 0) {
      let ret = await Request.post("/api/invest/status", {
        id: itemId,
        status: status
      });
      if (ret.code == 0) {
        this.$store.dispatch("investListGet", this.$route);
      } else {
        alert("操作失败");
      }
    },
    async investDelete(itemId) {
      let ret = await Request.post("/api/invest/status", {
        id: itemId,
        status: -1
      });
      if (ret.code == 0) {
        this.$store.dispatch("investListGet", this.$route);
      } else {
        alert("操作失败:" + ret.message);
      }
    }
  }
};
</script>
