<template>
  <div class="tab">
    <router-link tag="div" class="tab-item" to="/recommend">
      <span class="tab-link">推荐</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/singer">
      <span class="tab-link">歌手</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/rank">
      <span class="tab-link">排行
      </span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/search">
      <span class="tab-link">搜索</span>
    </router-link>
  </div>
</template>

<script>
export default {
  
}
</script>

<style>
  .tab {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 1vh 0;
  }
  .tab-item {
    color: var(--color-text-l);
    font-size: 2.3vh;
    line-height: 1.5;
  }
  .router-link-active {
    color: var(--color-theme);
    border-bottom: 0.3vh solid var(--color-theme);
  }

</style>