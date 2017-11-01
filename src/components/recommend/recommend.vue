<template>
  <div class="recommend" ref="recommend">
    <scroll ref="scroll" class="recommend-content" :data="discList">
      <div>
        <div v-if="recommends.length">
          <slider>
            <div v-for="item of recommends">
              <a :href="item.url">
                <img class="needsclick" @load="loadImage" :src="item.pic">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li @click.prevent="selectItem(item)" v-for="item in discList" class="item">
              <div class="item-icon">
                <img v-lazy="item.coverImgUrl">
              </div>
              <div class="item-text">
                <h2>{{item.name }}</h2>
                <p>{{ item.tags.join(' | ')}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
    <!-- <div class="playlist" ref="playlist"> -->
      <!-- <list-view @select="selectPlaylist" :data="playlist" ref="playlist"></list-view> -->
      <router-view></router-view>
    <!-- </div> -->
  </div>
</template>

<script>
import Slider from '@/base/slider/slider'
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'
import {getRecommend, getDiscList} from '@/api/recommend.js'
import {ERR_OK} from '@/api/config'
import {playlistMixin} from '@/common/js/mixin'
import {mapGetters, mapMutations} from 'vuex'
import {createDisk} from '@/common/js/disk'

export default {
  mixins: [playlistMixin],
  data() {
    return {
      recommends: [],
      discList: [],
    }
  },
  computed: {
    ...mapGetters([
      'playlist',
    ])
  },
  created() {
    this._getRecommend();
    this._getDiscList();
  },
  methods: {
    handlePlaylist() {
      if (this.playlist.length > 0) {
        this.$refs.recommend.style.bottom = '10vh';
        this.$refs.scroll.refresh();
      }
    },
    _getRecommend() {
      getRecommend().then((res) => {
        if (res.code === ERR_OK) {
          this.recommends = res.banners;
        }
      })
    },
    _getDiscList() {
      getDiscList().then((res) => {
        if (res.code === ERR_OK) {
          this.discList = res.playlists;
        }
      })
    },
    loadImage() {
      if (!this.checkloaded) {
        this.$refs.scroll.refresh();
        this.checkloaded = true; // 标志位，保证执行一次
      }
    },
    selectItem(item) {
      this.$router.push({
        path: `/recommend/${item.id}`,
      });
      this.setDisk(createDisk(item));
    },
    ...mapMutations({
      setDisk: 'SET_DISK',
    }),
  },
  components: {
    Slider,
    Scroll,
    Loading,
  }
}
</script>

<style>
.recommend {
  position: fixed;
  width: 100%;
  top: 11.5vh;
  bottom: 0;
}
.recommend-content {
  height: 100%;
  overflow: hidden;
}
.list-title {
  font-size: 4vw;
  text-align: center;
  color: var(--color-theme);
  padding-top: 2vh;
}
.loading-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;
}
.recommend-list ul {
  list-style: none;
}
.item {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 20vw;
  padding: 2vh 4vw;
}
.item-icon {
  width: 20vw;
  margin-right: 4vw;
}
.item-icon img {
  width: 100%;
  object-fit: cover;
}
.item-text {
  width: 76%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-around;
  align-items: flex-start;
  font-size: 3vw;
}
.item-text h2 {
  color: var(--color-text);
  font-weight: 400;
  font-size: 4vw;
  width: 100%;
}
.item-text p {
  width: 100%;
  font-size: 4vw;
  color: var(--color-text-d);
  text-overflow: -o-ellipsis-lastline;  
  overflow: hidden;  
  text-overflow: ellipsis;  
  display: -webkit-box;  
  -webkit-line-clamp: 2;  
  -webkit-box-orient: vertical;
}
</style>
