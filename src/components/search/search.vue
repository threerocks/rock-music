<template>
  <div class="wrapper">
    <div class="search-box-wrapper">
      <search-box class="search-box" ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <div class="hotkey" v-show="!query">
      <h2>热门搜索</h2>
      <ul class="key-wrapper">
        <li @click="selectHotkey(key)" class="key-item" v-for="key in hotkey">
          <span class="key-text">{{key.k}}</span>
        </li>
      </ul>
    </div>
    <div class="search-result" ref="searchResult" v-show="query">
      <suggest ref="suggest" :query="query" class="suggest-item"></suggest>
    </div>
  </div>
</template>

<script>
  import SearchBox from '@/base/search-box/search-box'
  import {getHotkey} from '@/api/search'
  import {ERR_OK} from '@/api/config'
  import {shuffle} from '@/common/js/util'
  import Suggest from '@/components/suggest/suggest'
  import {playlistMixin} from '@/common/js/mixin'
  import {mapGetters} from 'vuex'

  const OK_CODE = 0;
  export default {
    mixins: [playlistMixin],
    data() {
      return {
        hotkey: [],
        query: '',
      }
    },
    created() {
      this._getHotkey();
    },
    computed: {
      ...mapGetters([
        'playlist'
      ])
    },
    methods: {
      handlePlaylist() {
        if (this.playlist.length > 0) {
          this.$refs.suggest.$el.style.bottom = '10vh';
          this.$refs.suggest.$el.style.height = '68vh';
          this.$refs.suggest.refresh();
        }
      },
      onQueryChange(query) {
        this.query = query;
      },
      selectHotkey(key) {
        this.$refs.searchBox.setQuery(key.k);
      },
      _getHotkey() {
        getHotkey().then((res) => {
          if (res.code !== OK_CODE) return;
          this.hotkey = shuffle(res.data.hotkey).slice(0, 10);
        })
      },
    },
    watch: {
      query(newQuery) {
        if (!newQuery) {

        }
      },
    },
    components: {
      SearchBox,
      Suggest,
    }
  }
</script>

<style scoped>
  .wrapper {
    width: 100%;
  }
  .search-box-wrapper {
    width: 100%;
    margin: 3vh 0;
    display: flex;
    justify-content: center;
  }
  .search-box {
    width: 90%;
  }
  .hotkey {
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
  }
  .hotkey h2 {
    width: 90%;
    font-size: 2.2vh;
    color: var(--color-text-l);
  }
  .key-item {
    display: inline-block;
    background: var(--color-highlight-background);
    font-size: 2.2vh;
    padding: 1vh 3vw;
    border-radius: 10px;
    margin: 2vw 3vw 2vw 0 ;
    color: var(--color-text-l);
  }
  .key-wrapper {
    width: 90%;
    margin: 2vh 0;
  }
  .search-result {
    position: absolute;
    bottom: 0;
    height: 78vh;
    width: 100%;
  }
  .suggest-item {
    width: 100%;
    height: 100%;
  }
</style>