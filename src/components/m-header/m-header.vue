<template>
  <div class="m-header">
    <div class="icon"></div>
    <h1 class="text">Rock Music</h1>
  </div>
</template>

<script>
  export default {

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
  }
  .icon {
    width: var(--header-height);
    height: var(--header-height);
    background: url('music.svg');
    background-size: cover;
  }
  .text {
    margin-left: 2vw;
    color: var(--color-theme);
    font-size: 3vh;
    font-weight: 400;
  }
</style>
