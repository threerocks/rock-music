<template>
  <div id="app" class="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import MHeader from '@/components/m-header/m-header';
  import Tab from '@/components/tab/tab'
  export default {
    components: {
      MHeader,
      Tab
    }
  }
</script>

<style>
  @import 'common/css/base.css';
  .app {
    width: 100%;
    overflow: hidden;
  }
</style>
