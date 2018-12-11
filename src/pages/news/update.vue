<template>
  <div class="page-news-update">
    <div class="row">
      <div class="col-6">
        <h6>新闻资讯添加编辑</h6>
      </div>
      <div class="col-6 text-right">
        <a href="javascript:history.go(-1)" class="btn btn-outline-primary">返回</a>
      </div>
      <div class="col-12">
        <hr>
      </div>
    </div>

    <form @submit.prevent="newsUpdateSubmit()" class="form">
      <div class="form-group row">
        <label for class="col-form-label col-3">标题</label>
        <div class="col-9">
          <input
            type="text"
            class="form-control"
            placeholder="请输入标题"
            required
            v-model="newsData.title"
          >
        </div>
      </div>

      <div class="form-group row">
        <label for class="col-form-label col-3">描述</label>
        <div class="col-9">
          <textarea
            class="form-control"
            rows="3"
            v-model="newsData.description"
            required
            placeholder="请输入文章描述"
          ></textarea>
        </div>
      </div>

      <div class="form-group row">
        <label for class="col-form-label col-3">详情</label>
        <div class="col-9">
          <textarea
            class="form-control"
            rows="10"
            v-model="newsData.content"
            placeholder="请输入文章内容"
            id="news-content"
            v-html="newsData.content"
          ></textarea>
        </div>
      </div>

      <div class="form-group row">
        <label for class="col-form-label col-3">发布时间</label>
        <div class="col-9">
          <input type="datetime-local" v-model="newsData.post_time" required class="form-control">
        </div>
      </div>

      <div class="form-group row">
        <label for class="col-form-label col-3">封面图</label>
        <div class="col-7">
          <input
            type="text"
            v-model.lazy="newsData.cover"
            required
            class="form-control"
            id="news-cover-input"
          >
          <div>
            <img :src="newsData.cover" alt id="news-cover-pre" height="100" class="mt-1">
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
        <label for class="col-form-label col-3">分类</label>
        <div class="col-9">
          <select v-model="newsData.category" class="form-control" required>
            <option value>请选择</option>
            <option value="NOTICE">官方公告</option>
            <option value="INDUSTRY">行业资讯</option>
          </select>
        </div>
      </div>

      <div class="form-group row">
        <label for class="col-form-label col-3">排序</label>
        <div class="col-9">
          <input type="number" v-model="newsData.sort" required class="form-control">
          <small class="form-text text-danger">越小越优先</small>
        </div>
      </div>

      <div v-if="newsType == 0" class="form-group row">
        <label for class="col-form-label col-3">APP</label>
        <div class="col-9">
          <select v-model="newsData.type" class="form-control" required>
            <option value>请选择</option>
            <option value="1">钱包APP</option>
            <option value="2">Dapp</option>
          </select>
        </div>
      </div>
      <div v-else>
        <input type="hidden" v-model="newsData.type">
      </div>

      <div class="form-group row">
        <label for class="col-form-label col-3">状态</label>
        <div class="col-9">
          <select v-model="newsData.status" class="form-control">
            <option value="0">禁用</option>
            <option value="1">正常</option>
          </select>
          <small class="form-text text-danger">选择禁用可设置条目状态</small>
        </div>
      </div>

      <div class="form-group row">
        <div class="col-12 text-right">
          <hr>
          <input type="hidden" v-model="newsData.id">
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
    window.imgBtn = Editor.createImgBtn("news-cover-btn", store);
  }

  cb();
};

export default {
  asyncData({ store, route }) {
    console.log("page init............");
    initKEditor(Editor, store, () => {
      console.log("page initKEditor at asyncData()");
    });

    let newsId = route.query.id || 0;

    if (newsId) {
      Request.get("/api/news/detail", { news_id: newsId }).then(ret => {
        console.log("request news detail", ret);
        store.state.newsData = ret.data;

        if (editor) {
          editor.sync();
          editor.html(ret.data.content);
        }
      });
    } else {
      store.state.newsData = {
        id: "",
        title: "",
        description: "",
        post_time: "",
        content: "",
        cover: "",
        status: 1,
        type: store.state.admin.type,
        category: "",
        sort: 0
      };
    }
  },
  data() {
    return {};
  },
  computed: {
    newsData() {
      return this.$store.state.newsData;
    },
    newsType() {
      return this.$store.state.admin.type;
    }
  },
  methods: {
    async newsUpdateSubmit() {
      let postData = this.newsData;

      editor.sync();
      postData.content = document.getElementById("news-content").value;
      postData.cover = document.getElementById("news-cover-input").value;

      console.log("newsUpdateSubmit().postData", postData);
      let ret = await Request.post("/api/news/update", postData);
      console.log("newsUpdateSubmit().postData ret", ret);
      if (ret.code === 0) {
        // location.href = '/'
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
