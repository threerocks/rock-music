<template>
  <div class="m-header">
    <div class="icon"></div>
    <h1 class="text">Rock Music</h1>
    <router-link tag="div" class="icon-user" to="/user">
      <img :src="iconUser">
    </router-link>
  </div>
</template>

<script>
  export default {
    computed: {
      iconUser() {
        return require('@/common/image/user_theme.svg');
      }
    }
  }
</script>

<style scoped>
  .m-header {
    --header-height: 6vh;
    width: 100vw;
    height: var(--header-height);
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  .icon {
    width: var(--header-height);
    height: var(--header-height);
    background: url('music.svg');
    background-size: cover;
  }
  .icon-user {
    width: calc(var(--header-height) / 1.4);
    height: calc(var(--header-height) / 1.4);
    position: absolute;
    right: 4vw;
  }
  .icon-user img {
    width: 100%;
    height: 100%;
  }
  .text {
    margin-left: 2vw;
    color: var(--color-theme);
    font-size: 3vh;
    font-weight: 400;
  }
</style>
