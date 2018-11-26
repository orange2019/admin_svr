<template>
  <div class="modal fade show" tabindex="-1" role="dialog" :id="id" :style="styleObj">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" v-html="title"></h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="closeModal">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <slot></slot>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="closeModal">关闭</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: "my-modal"
    },
    title: {
      type: String,
      default: "MODAL"
    },
    isOpen: {
      type: Number,
      default: 0
    }
  },
  mounted() {
    // this.isOpenModal = this.isOpen
  },
  watch: {
    isOpen(newVal, oldVal) {
      console.log("=====newVal", newVal);
      if (newVal == 1) {
        this.openModal();
      } else {
        this.closeModal();
      }
    }
  },
  data() {
    return {
      // isOpenModal: 0,
      styleObj: {
        display: this.isOpen ? "block" : "none",
        background: '#fff',
        opacity: '0.9'
      }
    };
  },
  methods: {
    openModal() {
      // this.isOpenModal = 1
      this.styleObj.display = "block";
      this.$emit("openModalAction");
    },
    closeModal() {
      // this.isOpenModal = 0

      this.styleObj.display = "none";
      this.$emit("closeModalAction");
    }
  }
};
</script>

<style>
</style>
