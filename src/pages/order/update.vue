<template>
<div class="page-order-update">
  <div class="row">
    <div class="col-6 text-left">
      <h4>订单详情</h4>
    </div>
    <div class="col-6 text-right">
      <a href="javascript:history.go(-1)" class="btn btn-outline-primary">返回</a>
    </div>
    <div class="col-12">
      <hr>
    </div>
  </div>
  <form @submit.prevent="orderUpdateSubmit()" class="form">
    <div class="form-group row">
      <label for class="col-form-label col-2">订单号</label>
      <div class="col-10">
        {{orderData.order_no}}
      </div>
    </div>
    <div class="form-group row">
        <label for class="col-form-label col-2">收件信息</label>
        <div class="col-10">
          <p>收件人:{{orderData.address.name}}</p>
          <p>联系方式:{{orderData.address.mobile}}</p>
          <p>地址:{{orderData.address.info}}</p>
        </div>
    </div>
    <div class="form-group row"  v-for="good in orderData.goods_items">
        <label for class="col-form-label col-2">购买商品</label>
        <div class="col-10">
          <p>商品名称:{{good.name}}</p>
          <p>商品面:<img :src="good.cover" height="100"/></p>
          <p>商品单价:{{good.price}}</p>
          <p>商品数量:{{good.count}}</p>
        </div>
    </div>
    <div class="form-group row">
      <label for class="col-form-label col-2">客户备注</label>
      <div class="col-10">
        {{orderData.remark}}
      </div>
    </div>
    <div class="form-group row">
      <label for class="col-form-label col-2">订单总额</label>
      <div class="col-10">
        {{orderData.amount}}
      </div>
    </div>
    <div class="form-group row">
      <label for class="col-form-label col-2">物流公司</label>
      <div class="col-10">
        <input
          type="text"
          class="form-control"
          placeholder="请输入物流公司名称"
          v-model="orderData.logistics_company"
        >
      </div>
    </div>
    <div class="form-group row">
      <label for class="col-form-label col-2">物流单号</label>
      <div class="col-10">
        <input
          type="text"
          class="form-control"
          placeholder="请输入物流单号"
          v-model="orderData.logistics_no"
        >
      </div>
    </div>
    <div class="form-group row">
        <div class="col-12 text-right">
          <hr>
          <input type="hidden" v-model="orderData.id">
          <input type="submit" value="更新信息" class="btn btn-success pl-5 pr-5">
        </div>
      </div>
  </form>
</div>
  
</template>
<script>
import Request from "./../../api/common/request";

export default{
   asyncData({ store, route }) {
    console.log("page init............");
    // initKEditor(Editor, store, () => {
    //   console.log("page initKEditor at asyncData()");
    // });

    let orderId = route.query.id || 0;

    Request.post("/api/order/orderDetail", { order_id: orderId }).then(ret => {
      console.log("request order detail", ret);
      store.state.orderData = ret.data;
    })
   
    
    
  },
  computed: {
    orderData() {
      return this.$store.state.orderData;
    },
  },
   methods: {
    async orderUpdateSubmit() {
      let orderData = this.orderData;

      // editor.sync();
      // postData.content = document.getElementById("news-content").value;
      // postData.cover = document.getElementById("news-cover-input").value;

      console.log("orderUpdateSubmit().orderData", orderData);
      let ret = await Request.post("/api/order/orderModify", orderData);
      console.log("orderUpdateSubmit().orderData ret", ret);
      if (ret.code === 0) {
        // location.href = '/'
        alert("提交成功");
        this.$router.go(-1);
      } else {
        alert("提交失败:" + ret.message);
      }
    }
  },
  inject: ["reload"]
}
</script>