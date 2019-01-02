<template>
  <div class="page-category-update">
    <div class="row">
      <div class="col-6 text-left">
        <h4>新建分类</h4>
      </div>
      <div class="col-6 text-right">
        <a href="javascript:history.go(-1)" class="btn btn-outline-primary">返回</a>
      </div>
      <div class="col-12">
        <hr>
      </div>
    </div>
    <form @submit.prevent="videoCreateSubmit()" class="form">
    <div class="form-group row">
      <label for class="col-form-label col-2">视频名称</label>
      <div class="col-10">
        <input
          type="text"
          class="form-control"
          placeholder="请输入视频名称"
          v-model="videoData.title"
        >
      </div>
    </div>
    <div class="form-group row">
      <label for class="col-form-label col-2">视频简介</label>
      <div class="col-10">
        <input
          type="text"
          class="form-control"
          placeholder="请输入视频简介"
          v-model="videoData.description"
        >
      </div>
    </div>

    <div class="form-group row">
      <label for class="col-form-label col-2">视频连接</label>
      <div class="col-10">
        <input
          type="text"
          class="form-control"
          placeholder="请输入视频连接"
          v-model="videoData.url"
        >
      </div>
    </div>

    <div class="form-group row">
      <label for class="col-form-label col-3">封面图
        <br>
        <span class="text-danger">（图片比例16：9）</span>
      </label>
      <div class="col-7">
        <input
          type="text"
          v-model.lazy="videoData.cover"
          required
          class="form-control"
          id="video-cover-input"
        >
        <div>
          <img :src="videoData.cover" alt id="video-cover-pre" height="100" class="mt-1">
        </div>
      </div>
      <div class="col-2">
        <input
          type="button"
          value="上传图片"
          id="video-cover-btn"
          class="btn btn-primary btn-block btn-sm"
        >
      </div>
    </div>

    <div class="form-group row">
      <label for class="col-form-label col-2">分类排序</label>
      <div class="col-10">
        <input
          type="text"
          class="form-control"
          placeholder="请输入分类排序"
          v-model="videoData.sort"
        >
      </div>
    </div>
    <div class="form-group row">
        <div class="col-12 text-right">
          <hr>
          <input type="hidden" v-model="videoData.id">
          <input type="submit" value="添加分类信息" class="btn btn-success pl-5 pr-5">
        </div>
    </div>
  </form>
  </div>
</template>
<script>
import Request from "./../../api/common/request";
import Editor from "./../../utils/editor.js";
let initKEditor = (Editor, store, cb) => {
  if (document.getElementById("video-cover-btn")) {
    window.imgBtn = Editor.createImgBtn("video-cover-btn", store);
  }

  cb();
};
export default {
  asyncData({ store, route }) {
    initKEditor(Editor, store, () => {
      console.log("page initKEditor at asyncData()");
    });

    store.state.videoData = {
      id: "",
      title: "",
      url: "",
      description: "",
      cover: "",
      status: 0,
      sort: 0
    }
  },
  computed: {
    videoData() {
      return this.$store.state.videoData;
    }
  },
  methods: {
      async videoCreateSubmit(){
        let videoData = this.videoData;
        editor.sync();
        console.log("videoCreateSubmit().videoData", videoData);
        videoData.cover = document.getElementById("video-cover-input").value;
        let ret = await Request.post("/api/video/add", videoData);
        console.log("videoCreateSubmit().videoData ret", ret);
        if (ret.code === 0) {
          // location.href = '/'
          alert("提交成功");
          this.$router.go(-1);
        } else {
          alert("提交失败:" + ret.message);
        }
      },

  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      console.log("beforeRouteEnter store", vm.$store.state);
      initKEditor(Editor, vm.$store, () => {
        console.log("page initKEditor at beforeRouteEnter()");
      });
    });
  },
  inject: ["reload"]

}
</script>
