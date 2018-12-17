<template>
  <div class>
    <h3>{{ inviteInfo.user ? inviteInfo.user.realname : '' }} / {{ inviteInfo.user ? inviteInfo.user.mobile : '' }}</h3>
    <hr>

    <div v-if="inviteInfo.invite && inviteInfo.invite.length">
      <div v-for="(items ,i) in inviteInfo.invite" class="mt-3">
        <strong class="h6">{{ i+1}}级</strong>
        <span
          class="text-primary mr-3 ml-3"
          v-for="item in items"
        >用户ID:{{item.id}} / 用户号码:{{item.mobile}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  asyncData({ store, route }) {
    store.dispatch("userInviteGet", { route });
  },
  computed: {
    inviteInfo() {
      return this.$store.state.inviteInfo || {};
    }
  }
};
</script>

