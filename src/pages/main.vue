<template>
  <div class>
    <h1 class="text-center">卡西慕后台管理</h1>
    <hr>

    <!-- <div class="text-center pb-3" v-html="loading"></div>

    <div class="table-responsive" v-if="count">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>用户Id</th>
            <th>电话号码</th>
            <th>姓名</th>
            <th>状态</th>
            <th>邀请好友统计 [ 级别 : 数量 ]</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items">
            <td>{{ item.id }}</td>
            <td>{{ item.mobile }}</td>
            <td>{{item.user_info ? item.user_info.realname : ''}}</td>
            <td>
              <span v-if="item.status == 0" class="text-danger">未审核</span>
              <span v-if="item.status == 1" class="text-success">正常</span>
            </td>
            <td>
              <div
                class="text-primary"
                style="cursor:pointer"
                @click="goTo('/user/invite' , item.id)"
                v-if="item.invite && item.invite.length"
              >
                <span v-for="(val, i) in item.invite" class>{{i+1}}级:{{val}}人&nbsp;&nbsp;</span>
              </div>
              <div v-else>无</div>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="page-pagination">
        <hr>
        <my-pagination
          :total="count"
          :display="size"
          :currentPage="currentPage"
          @pageChange="pageChange"
        ></my-pagination>
      </div>
    </div>-->
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchKey: ""
    };
  },
  asyncData({ store, route }) {},
  computed: {},
  methods: {}
};
</script>


