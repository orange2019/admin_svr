<template>
  <div class="page-goods-update">
    <div class="row">
      <div class="col-6">
        <h6>商品编辑</h6>
      </div>
      <div class="col-6 text-right">
        <a href="javascript:history.go(-1)" class="btn btn-outline-primary">返回</a>
      </div>
      <div class="col-12">
        <hr>
      </div>
    </div>

    <form @submit.prevent="goodCreateSubmit()" class="form">
      <div class="form-group row">
        <label for class="col-form-label col-3">标题</label>
        <div class="col-9">
          <input
            type="text"
            class="form-control"
            placeholder="请输入商品名称"
            required
            v-model="goodData.name"
          >
        </div>
      </div>

      <div class="form-group row">
        <label for class="col-form-label col-3">信息</label>
        <div class="col-9">
          <textarea
            class="form-control"
            rows="3"
            v-model="goodData.info"
            required
            placeholder="请输入商品信息"
          ></textarea>
        </div>
      </div>

      <div class="form-group row">
        <label for class="col-form-label col-3">描述</label>
        <div class="col-9">
          <textarea
            class="form-control"
            rows="10"
            v-model="goodData.description"
            placeholder="请输入商品描述"
            id="goods-content"
            v-html="goodData.description"
          ></textarea>
        </div>
      </div>

      <div class="form-group row">
        <label for class="col-form-label col-3">商品图片
          <br>
          <span class="text-danger">（图片比例16：9）</span>
        </label>
        <div class="col-7">
          <input
            type="text"
            v-model.lazy="goodData.cover"
            required
            class="form-control"
            id="goods-cover-input"
          >
          <div>
            <img :src="goodData.cover" alt id="news-cover-pre" height="100" class="mt-1">
          </div>
        </div>
        <div class="col-2">
          <input
            type="button"
            value="上传图片"
            id="news-cover-btn"
            class="btn btn-primary btn-block btn-sm"
          >
        </div>
      </div>
      <div class="form-group row">
        <label for class="col-form-label col-3">价格</label>
        <div class="col-9">
          <input
            type="text"
            class="form-control"
            placeholder="请输入商品价格"
            required
            v-model="goodData.price"
          >
        </div>
      </div>

      <div class="form-group row">
        <label for class="col-form-label col-3">库存</label>
        <div class="col-9">
          <input
            type="text"
            class="form-control"
            placeholder="请输入商品库存"
            required
            v-model="goodData.stock"
          >
        </div>
      </div>

       <div class="form-group row">
        <div class="col-12 text-right">
          <hr>
          <input type="submit" value="提交" class="btn btn-success pl-5 pr-5">
          <input type="reset" value="重置" class="btn btn-warning pl-5 pr-5">
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import Request from "./../../api/common/request";
import Editor from "./../../utils/editor.js";

let initKEditor = (Editor, store, cb) => {
  if (document.getElementById("news-content")) {
    window.editor = Editor.createEditor("news-content");
  }
  if (document.getElementById("news-cover-btn")) {
    window.imgBtn = Editor.createImgBtn("news-cover-btn", url => {
      store.state.goodData.cover = url;
    });
  }

  cb();
};

export default {
  asyncData({ store, route }) {
    console.log("page init............");
    initKEditor(Editor, store, () => {
      console.log("page initKEditor at asyncData()");
    });
    store.state.goodData = {
        c_id: "",
        name: "",
        cover: "",
        info: "",
        description: "",
        price: "",
        stock: 0,
        status: 0,
    } 
  },
  data() {
    return {};
  },
  computed: {
    goodData() {
      return this.$store.state.goodData;
    },
  },
  methods: {
    async goodCreateSubmit() {
      let postData = this.goodData;

      editor.sync();
      postData.description = document.getElementById("goods-content").value;
      postData.cover = document.getElementById("goods-cover-input").value;

      console.log("goodCreateSubmit().postData", postData);
      let ret = await Request.post("/api/goods/addGood", postData);
      console.log("goodCreateSubmit().postData ret", ret);
      if (ret.code === 0) {
        alert("提交成功");
        this.$router.go(-1);
      } else {
        alert("提交失败:" + ret.message);
      }
    }
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
};
</script>
