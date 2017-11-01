<template>
  <div>
    <scroll class="wrapper" :data="rankList" ref="list">
      <div class="content" res="content">
        <ul>
          <li class="rank-item" @click="selectRank(rank)" v-for="rank in rankList">
            <div class="rank-l">
              <img :src="rank.image" class="rank-image">
            </div>
            <div class="rank-r">
              <p v-for="(item, index) in rank.showSongs">{{index + 1}}. {{item.name}}</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="loading-container" v-show="!rankList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
  import {getRankList} from '@/api/rank'
  import Scroll from '@/base/scroll/scroll'
  import Loading from '@/base/loading/loading'
  import {mapMutations, mapGetters} from 'vuex'
  import {playlistMixin} from '@/common/js/mixin'

  export default {
    mixins: [playlistMixin],
    data() {
      return {
        rankList: [],
      }
    },
    created() {
      this._getRankList();
    },
    computed: {
      ...mapGetters([
        'playlist'
      ]),
    },
    methods: {
      handlePlaylist() {
        if (this.playlist.length > 0) {
          this.$refs.list.$el.style.bottom = '10vh';
          this.$refs.list.$el.style.height = '78.5vh';
          this.$refs.list.refresh();
        }
      },
      selectRank(rank) {
        this.$router.push({
          path: `/rank/${rank.id}`,
        });
        this.setRank(rank);
      },
      _getRankList (){
        getRankList().then((data) => {
          this.rankList = data;
          this._getShowSongs(this.rankList);
        })
      },
      _getShowSongs(ranks) {
        for (const rank of ranks) {
          rank.showSongs = rank.songs.slice(0, 3);
        }
      },
      ...mapMutations({
        setRank: 'SET_RANK'
      }),
    },
    components: {
      Scroll,
      Loading,
    }
  }
</script>

<style scoped>
  .wrapper {
    position: fixed;
    width: 100%;
    bottom: 0;
    height: 88.5vh;
    overflow: hidden;
  }
  .content {
    left: 0;
    right: 0;
    margin: auto;
    width: 90%;
    padding: 3vh 0;
  }
  .rank-item {
    width: 100%;
    height: 15vh;
    display: flex;
    background-color: var(--color-highlight-background);
  }
  .rank-item:not(:first-child) {
    margin-top: 3vh;
  }
  .rank-l {
    --item-height: 15vh;
    position: relative;
    width: var(--item-height);
    height: var(--item-height);
  }
  .rank-image {
    width: 100%;
    height: 100%;
  }
  .rank-r {
    width: 60%;
    padding: 5%;
  }
  .rank-r p {
    width: 100%;
    white-space:nowrap;
    word-break:keep-all;
    overflow:hidden;
    text-overflow:ellipsis;
    font-size: 2.2vh;
    color: var(--color-text-l);
    height: 30%;
  }
  .loading-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 99;
  }
</style>