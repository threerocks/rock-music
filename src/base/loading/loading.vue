<template>
  <div class="loading">
    <img src="./loading.gif">
    <p class="desc">{{title}}</p>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: '正在载入...'
      }
    }
  }
</script>
<style>
  .loading {
    --loading-width: 20vw;
    width: 24px;
    height: 24px;
    width: var(--loading-width);
    height: var(--loading-width);
  }
  .loading img {
    width: 100%;
    height: 100%;
  }
  .loading p {
    font-size: 3vw;
    color: var(--color-text-l);
    text-align: center;
    margin: 0;
  }
</style>