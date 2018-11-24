<template>
  <div class="page-news-update">

    <h6>新闻资讯添加编辑</h6>
    <hr>

    <form @submit.prevent="newsUpdateSubmit" class="form">
      <div class="form-group row">
        <label for="" class="col-form-label col-3">标题</label>
        <div class="col-9">
          <input type="text" class="form-control" placeholder="请输入标题" required v-model="newsData.title">
        </div>
        
      </div>

      <div class="form-group row">
        <label for="" class="col-form-label col-3">描述</label>
        <div class="col-9">
          <textarea class="form-control" rows="3" v-model="newsData.description" required placeholder="请输入文章描述"></textarea>
        </div>
        
      </div>

      <div class="form-group row">
        <label for="" class="col-form-label col-3">详情</label>
        <div class="col-9">
          <textarea class="form-control" rows="10" v-model="newsData.content" required placeholder="请输入文章内容" id="news-content"></textarea>
        </div>
        
      </div>

      <div class="form-group row">
        <label for="" class="col-form-label col-3">发布时间</label>
        <div class="col-9">
          <input type="datetime-local" v-model="newsData.post_time" required class="form-control">
        </div>
        
      </div>

      <div class="form-group row">
        <label for="" class="col-form-label col-3">封面图</label>
        <div class="col-7">
          <input type="url" v-model="newsData.cover" required class="form-control" id="news-cover-input" readonly>
          <div v-if="newsData.cover">
            <img :src="newsData.cover" alt="" id="news-cover-pre" height="100" class="mt-1">
          </div>
          <div v-else>
            <img src="" alt="" id="news-cover-pre" height="100" class="mt-1">
          </div>
        </div>
        <div class="col-2">
          <input type="button" value="上传图片" id="news-cover-btn" class="btn btn-primary btn-block">
        </div>
      </div>

      <div class="form-group row">
        <label for="" class="col-form-label col-3">分类</label>
        <div class="col-9">
          <select v-model="newsData.category" class="form-control" required>
            <option value="">请选择</option>
            <option value="COMPANY">公司新闻</option>
            <option value="INSTRUTY">行业新闻</option>
          </select>
        </div>
      </div>

      <div class="form-group row">
        <label for="" class="col-form-label col-3">排序</label>
        <div class="col-9">
          <input type="number" v-model="newsData.sort" required class="form-control">
          <small class="form-text text-danger">越小越优先</small>
        </div>
      </div>

      <div v-if="newsType == 0" class="form-group row">
        <label for="" class="col-form-label col-3">APP</label>
        <div class="col-9">
          <select v-model="newsData.type" class="form-control" required >
            <option value="">请选择</option>
            <option value="1">钱包APP</option>
            <option value="2">Dapp</option>
          </select>
        </div>
      </div>
      <div v-else>
        <input type="hidden" v-model="newsData.type">
      </div>

      <div class="form-group row">
        <label for="" class="col-form-label col-3">状态</label>
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
          <input type="submit" value="提交" class="btn btn-success pl-5 pr-5" >
          <input type="reset" value="重置" class="btn btn-warning pl-5 pr-5" >
        </div>

      </div>

    </form>
  </div>
</template>

<script>
import Request from './../../api/common/request'
import Editor from './../../utils/editor.js'

export default {

  asyncData({store, route}) {

    Editor.createEditor('#news-content').then(editor => {
      window.editor = editor
    })
    Editor.createImgBtn('#news-cover-btn' , 'news-cover-input' , 'news-cover-pre').then(imgBtn => {
      window.imgBtn = imgBtn
    })

    console.log('page-inti............')

    let newsId = route.query.id || 0
    
    if(newsId){
      Request.get('/api/news/detail' , {news_id : newsId}).then(ret => {
        console.log('request news detail' , ret)
        store.state.newsData = ret.data

        editor.sync()
        editor.html(ret.data.content)
      })
    }else {
      store.state.newsData = {
        id: "",
        title: "",
        description: "",
        post_time: "",
        content: "",
        cover: "",
        status: 1,
        type: 0,
        category: "",
        sort: 0
      }
    }


  },
  data() {
    return {
      
    };
  },
  computed: {
    newsData(){
      
      return this.$store.state.newsData
    },
    newsType(){
      return this.$store.state.admin.type
    }
  },
  methods: {
    async newsUpdateSubmit() {
      let postData = this.newsData

      editor.sync()
      postData.content = document.getElementById('news-content').value
      postData.cover = document.getElementById('news-cover-input').value
   
      let ret = await Request.post('/api/news/update' , postData)
      // console.log(ret)
      if(ret.code === 0){
        // location.href = '/'
        alert('提交成功')
      }else {
        alert('提交失败:' + ret.message )
      }
    }
  }
};
</script>
