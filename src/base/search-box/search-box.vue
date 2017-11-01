<template>
  <div class="wrapper">
    <img class="icon" :src="searchIcon">
    <input v-model="query" :placeholder="placeholder" ref="query" class="query">
    <img class="icon" :src="removeIcon" v-show="query" @click="removeQuery">
  </div>
</template>

<script>
  import {debounce} from '@/common/js/util'

  export default {
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    },
    data() {
      return {
        query: '',
      }
    },
    computed: {
      searchIcon() {
        return require('@/common/image/search.svg')
      },
      removeIcon() {
        return require('@/common/image/remove.svg')
      },
    },
    methods: {
      removeQuery() {
        this.query = '';
      },
      setQuery(query) {
        this.query = query
      },
    },
    created() {
      this.$watch('query', debounce((newQuery) => {
        this.$emit('query', newQuery)
      }, 200));
    }
  }
</script>

<style scoped>
  .wrapper {
    height: 6vh;
    background: var(--color-highlight-background);
    border-radius: 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .icon {
    width: 5%;
  }
  .icon:first-child {
    margin-left: 5%;
  }
  .icon:last-child {
    margin-right: 5%;
  }
  .query {
    height: 60%;
    width: 70%;
    font-size: 2.2vh;
    margin: 0 5%;
    background: transparent;
    color: var(--color-text-l);
    border: none;
  }

</style>