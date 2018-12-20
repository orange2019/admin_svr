<template>
  <div class="page-login">
    <form @submit.prevent="login" class="form-login">
      <div class="form-group">
        <label for="col-form-label">邮箱</label>
        <div class>
          <input
            type="email"
            v-model="postData.email"
            placeholder="请输入邮箱地址"
            required
            class="form-control"
          >
        </div>
      </div>

      <div class="form-group">
        <label for="col-form-label">密码</label>
        <div class>
          <input
            type="password"
            v-model="postData.password"
            placeholder="请输入密码"
            required
            class="form-control"
          >
        </div>
      </div>

      <div class="form-group">
        <label for="col-form-label">验证码</label>
        <div class="row">
          <div class="col-8">
            <input
              type="text"
              v-model="postData.captcha"
              placeholder="请输入验证码"
              required
              class="form-control"
            >
          </div>
          <div class="col-4" width="100%">
            <img :src="captchaUrl" alt @click="changeCaptcha" title="点击更换">
          </div>
        </div>
      </div>

      <div class="form-group row">
        <div class="col-12">
          <hr>
        </div>
        <div class="col-6">
          <input type="submit" value="提交" class="btn btn-success btn-block">
        </div>
        <div class="col-6">
          <input type="reset" value="重置" class="btn btn-warning btn-block">
        </div>
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
        email: "",
        password: "",
        captcha: ""
      },
      captchaUrl: "/captcha"
    };
  },
  computed: {},
  methods: {
    async login() {
      let postData = this.postData;
      let ret = await Reqeust.post("/api/auth/login", postData);
      console.log(ret);
      if (ret.code === 0) {
        location.href = "/";
      } else {
        alert("登录失败，" + ret.message);
      }
    },
    changeCaptcha() {
      this.captchaUrl = "/captcha?t=" + Date.now();
    }
  }
};
</script>


