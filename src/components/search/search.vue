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
      <suggest ref="suggest" @search="search" :query="query" class="suggest-item"></suggest>
    </div>
    <div class="history">
      <div class="history-title">
        <h2>搜索历史</h2><img class="delete-icon" :src="iconDelete" @click.stop="clearHistory">
      </div>
      <ul class="key-wrapper" v-show="searchHistory.length">
        <li @click="selectHistory(history)" class="history-item" v-for="(history, index) in searchHistory">
          <span class="history-text">{{history}}</span><img @click.stop="deleteHistoryItem(index)" :src="iconRemove">
        </li>
      </ul>
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
  import {mapGetters, mapActions} from 'vuex'
  import {saveSearch} from '@/common/js/cache'

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
      iconDelete() {
        return require('@/common/image/delete.svg');
      },
      iconRemove() {
        return require('@/common/image/remove.svg');
      },
      ...mapGetters([
        'playlist',
        'searchHistory'
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
      search() {
        this.saveSearchHistory(this.query);
      },
      onQueryChange(query) {
        this.query = query;
      },
      selectHotkey(key) {
        this.$refs.searchBox.setQuery(key.k);
      },
      selectHistory(history) {
        this.$refs.searchBox.setQuery(history);
      },
      deleteHistoryItem(index) {
        this.deleteSearchHistory(index);
      },
      clearHistory() {
        this.clearSearchHistory();
      },
      _getHotkey() {
        getHotkey().then((res) => {
          if (res.code !== OK_CODE) return;
          this.hotkey = shuffle(res.data.hotkey).slice(0, 6);
        })
      },
      ...mapActions([
        'saveSearchHistory',
        'deleteSearchHistory',
        'clearSearchHistory',
      ])
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
  .history, .hotkey {
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
    list-style: none;
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
  .delete-icon {
    height: 100%;
  }
  .history {
    margin-top: 3vh;
  }
  .history-title {
    width: 90%;
    height: 3vh;
    color: var(--color-text-l);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .history-title h2 {
    font-size: 2.2vh;
  }
  .history-item {
    font-size: 2.2vh;
    height: 3vh;
    padding: 1vh 0;
    border-radius: 10px;
    margin: 2vw 0 2vw;
    color: var(--color-text-l);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .history-item img {
    height: 3vh;
  }
  .history-text {

  }
</style>