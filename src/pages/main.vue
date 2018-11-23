<template>
<div>
  <p>Home</p>
  <p></p>
</div>
</template>

<script>
export default {
  data() {
    return {
      
    }
  },
  computed: {
    username () {
  
    },
    getCount() {
      
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


