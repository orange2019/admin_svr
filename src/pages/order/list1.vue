<template>
  <div class="page-order-list">
      <li v-for="item in items">
        {{item.id}}
      </li>

      <div class="page-pagination">
        <hr>
        <my-pagination :total="count" :display="size" :currentPage="currentPage" @pageChange="pageChange"></my-pagination>
      </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
 asyncData({ store, route }) {
    store.dispatch('orderList' , {route : route})
  },
  computed: {
    items() {
      return this.$store.state.listItems;
    },
    count() {
      return this.$store.state.listCount;
    },
    size(){
      return this.$store.state.listLimit;
    },
    currentPage(){
      return this.$store.state.listCurrentNum
    },
  },
  methods: {
    pageChange(num){
      // this.$store.state.listCurrentNum = num
      let query = this.$route.query
      let pushQuery = {}
      Object.keys(query).forEach(key => {
        if(key != 'page'){
          pushQuery[key] = query[key]
        }
        
      })
      pushQuery.page = num
      // console.log('pageChange.query' , query)
      this.$router.push({path: '/mall' , query: pushQuery })
      this.$store.dispatch('goodList' , {route : this.$route})
      // setTimeout(() => {
      //   this.$router.go(0)
      // }, 0);
      // 
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {});
  }
};
</script>