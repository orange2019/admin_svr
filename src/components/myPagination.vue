<template>
  <ul class="pagination">
    <li :class="{'page-item disabled': current == 1}">
      <a href="javascript:;" @click="setCurrent(current - 1)" class="page-link"> « </a>
    </li>
    <li :class="{'page-item disabled': current == 1}">
      <a href="javascript:;" @click="setCurrent(1)" class="page-link"> 首页 </a>
    </li>
    <li v-for="p in grouplist" :class="{'active': current == p.val}" class="page-item">
      <a href="javascript:;" @click="setCurrent(p.val)" class="page-link"> {{ p.text }} </a>
    </li>
    <li :class="{'page-item disabled': current == page}">
      <a href="javascript:;" @click="setCurrent(page)" class="page-link"> 尾页 </a>
    </li>
    <li :class="{'page-item disabled': current == page}">
      <a href="javascript:;" @click="setCurrent(current + 1)" class="page-link"> »</a>
    </li>
  </ul>
</template>

<script>
  export default {
    data() {
      return {
        current: this.currentPage
      };
    },
    props: {
      total: {
        type: Number,
        default: 0,
      },
      display: {
        type : Number,
        default: 10
      }, // 每页显示条数
      currentPage: {
        type: Number,
        default:1
      },
      size: {
        // 分页条数
        type: Number,
        default: 5,
        coerce: function(v) {
          v = v > 0 ? v : 5;
          return v % 2 === 1 ? v : v + 1;
        }
      }
    },
    computed: {
      page: function() {
        // 总页数
        return Math.ceil(this.total / this.display);
      },
      grouplist: function() {
        // 获取分页页码
        var len = this.page,
          temp = [],
          list = [],
          count = Math.floor(this.size / 2),
          center = this.current;
        if (len <= this.size) {
          while (len--) {
            temp.push({
              text: this.page - len,
              val: this.page - len
            });
          }
          return temp;
        }
        while (len--) {
          temp.push(this.page - len);
        }
        var idx = temp.indexOf(center);
        idx < count && (center = center + count - idx);
        this.current > this.page - count && (center = this.page - count);
        temp = temp.splice(center - count - 1, this.size);
        do {
          var t = temp.shift();
          list.push({
            text: t,
            val: t
          });
        } while (temp.length);
        if (this.page > this.size) {
          this.current > count + 1 &&
            list.unshift({
              text: "...",
              val: list[0].val - 1
            });
          this.current < this.page - count &&
            list.push({
              text: "...",
              val: list[list.length - 1].val + 1
            });
        }
        return list;
      }
    },
    methods: {
      setCurrent: function(idx) {
        if (this.current != idx && idx > 0 && idx < this.page + 1) {
          this.current = idx;
          this.$emit("pageChange", this.current);
        }
      }
    }
  };
</script>

