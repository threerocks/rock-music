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
            <li @click="selectItem(item)" v-for="item in discList" class="item">
              <div class="item-icon">
                <img v-lazy="item.picUrl">
              </div>
              <div class="item-text">
                <h2 v-html="item.name"></h2>
                <p v-html="item.copywriter"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loading-container" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import Slider from '@/base/slider/slider'
import Scroll from '@/base/scroll/scroll'
import Loading from '@/base/loading/loading'
import {getRecommend, getDiscList} from '@/api/recommend.js'
import {ERR_OK} from '@/api/config'

export default {
  data() {
    return {
      recommends: [],
      discList: [],
    }
  },
  created() {
    this._getRecommend();
    this._getDiscList();
  },
  methods: {
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
          this.discList = res.result;
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
      
    }
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
  top: 14vh;
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
  height: 80%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 3vw;
}
.item-text h2 {
  color: var(--color-text);
  font-weight: 400;
}
.item-text p {
  color: var(--color-text-d);
}
</style>
