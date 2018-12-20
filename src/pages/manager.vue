<template>
  <div class="w-50">
    <hr>
    <h3>修改管理员信息</h3>

    <form @submit.prevent="submitMan">
      <div class="form-group row">
        <label for class="col-form-label col-4">邮箱</label>
        <div class="col-8">
          <input type="email" class="form-control" required readonly v-model="adminInfo.email">
        </div>
      </div>

      <div class="form-group row">
        <label for class="col-form-label col-4">旧密码</label>
        <div class="col-8">
          <input type="password" class="form-control" required v-model="postData.password_old">
        </div>
      </div>

      <div class="form-group row">
        <label for class="col-form-label col-4">新密码</label>
        <div class="col-8">
          <input type="password" class="form-control" required v-model="postData.password">
        </div>
      </div>

      <div class="form-group row">
        <label for class="col-form-label col-4">再次输入新密码</label>
        <div class="col-8">
          <input type="password" class="form-control" required v-model="postData.password_again">
        </div>
      </div>

      <div class="form-group text-right">
        <hr>
        <input type="submit" value="提交" class="btn btn-primary">
        <input type="reset" value="重置" class="btn btn-warning">
      </div>
    </form>
  </div>
</template>

<script>
import Reqeust from "./../api/common/request";
export default {
  data() {
    return {
      postData: {
        password_old: "",
        password: "",
        password_again: ""
      }
    };
  },
  computed: {
    adminInfo() {
      return this.$store.state.admin || {};
    }
  },
  methods: {
    async submitMan() {
      let postData = this.postData;
      console.log(postData);
      if (postData.password != postData.password_again) {
        alert("两次输入密码不一致");
        return;
      }

      let ret = await Reqeust.post("/api/auth/adminUpdate", postData);
      console.log(ret);
      if (ret.code === 0) {
        alert("修改成功");
        location.href = "/";
      } else {
        alert("修改失败，" + ret.message);
      }
    }
  }
};
</script>
