<template>
<div>
  <p>Home</p>
  <p>{{ getCount }}</p>
</div>
</template>

<script>
export default {
  data() {
    return {
      count: 0
    }
  },
  computed: {
    username () {
      // 我们很快就会看到 `params` 是什么
      return this.$route.params.username
    },
    getCount() {
      console.log('======' , this.$store.state.count)
      this.$store.dispatch('incrementSync')
      this.count = this.$store.state.count
      return this.count
    }
  },
  methods: {
    goBack () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/')
    }
  }
}
</script>


