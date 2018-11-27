<template>
  <div class="page-config">
    <h6>系统设置</h6>
    <hr>
    <div class="mt-3">
      <form @submit.prevent="configSubmit('rateLevel')">
        <div class="form-group row">
          <label for="" class="col-12 col-form-label">子集收益率规律(百分比数字，| 分隔)</label>
          <div class="col-10">
            <input type="text" class="form-control" placeholder="" v-model="config.rateLevel">
          </div>
          <div class="col-2">
            <input type="submit" class="btn btn-primary btm-sm btn-block" value="设置">
          </div>
        </div>
      </form>
      <hr>
    </div>
    <div class="mt-3">

        <form action="mt-3" @submit.prevent="configSubmit('investList')">
          <div class="row">
        <div class="col-6">
          <label for="">投产条目配置</label>
        </div>
        <div class="col-6 text-right">
          <a href="javascrpt:;" class="btn btn-outline-primary mb-3" @click="investConfigAdd">添加一条</a>
          <input type="submit" class="btn btn-primary mb-3 pl-5 pr-5" value="提交">
        </div>
      </div>
        <table class="table">
          <tr>
            <th>数量</th>
            <th>天数</th>
            <th>收益率</th>
            <th></th>
          </tr>
          <tr v-for="(item,key) in config.investList">
      
            <td>
              <input type="number" class="form-control" v-model="item.num" required>
            </td>
            <td>
              <input type="number" class="form-control" v-model="item.days" required>
            </td>
            <td>
              <input type="text" class="form-control" v-model="item.rate" required>
            </td>
            <td>
              <a href="javascript:;" @click="investConfigDelete(key)" class="btn btn-outline-danger btn-sm btn-block">删除</a>
            </td>
          </tr>
        </table>
        
      </form>
    </div>
  </div>
</template>

<script>
export default {
  asyncData({store , route}){
    store.dispatch('configGet' , {name: 'rateLevel'})
    store.dispatch('configGet' , {name: 'investList'})
  },
  computed: {
    config(){
      return this.$store.state.config
    }
    // configRateLevel(){
       
    // },
    // configInvestList(){
    //   return this.$store.state.config.investList
    // }
  },
  methods: {
    investConfigAdd(){
      let list = this.$store.state.config.investList
      list.push({
        num: '',
        days:'',
        rate: ''
      })
      this.$store.state.config.investList = list.sort((x,y) => {
        return x['num'] - y['num'] 
      })
    },
    investConfigDelete(id){
      console.log('investConfigDelete key' , id)
      let list = this.$store.state.config.investList
      delete list[id]
      let newList = []
      list.forEach(element => {
        if(element){
          newList.push(element)
        }
      });
      this.$store.state.config.investList = newList.sort((x,y) => {
        return x['num'] - y['num'] 
      })
    },
    configSubmit(key){
      this.$store.dispatch('configSubmit' , {name : key})
    }
  }
}
</script>
