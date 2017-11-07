<template>
<div class="music-list">
    <div class="music-list-top" ref="top">
      <img class="music-list-back" :src="backImg" @click="back">
      <h1 class="music-list-title" v-html="title"></h1>
    </div>

    <div class="music-list-img" :style="bgStyle" ref="bgImage">
      <div ref="playBtn" class="play" v-show="songs.length" @click="random">
        <img class="icon-play" :src="bgPlay">
        <span class="text">随机播放全部</span>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="bgLayer"></div>
    <scroll :data="songs" 
            class="song-list-wrapper" 
            :probe-type="probeType"
            :listen-scroll="listenScroll"
            @scroll="scroll"
            ref="list"
    >
      <song-list @select="selectItem" :songs="songs" :icon="icon"></song-list>
      <div v-show="!songs.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
</div>

</template>

<script>
  import Scroll from '@/base/scroll/scroll'
  import SongList from '@/base/song-list/song-list'
  import Loading from '@/base/loading/loading'
  import {prefixStyle} from '@/common/js/dom'
  import {mapActions, mapGetters} from 'vuex'
  import {playlistMixin} from '@/common/js/mixin'

  const transform = prefixStyle('transform');
  const backdrop = prefixStyle('backdrop-filter');

  export default {
    mixins: [playlistMixin],
    props: {
      bgImage: {
        type: String,
        default: '',
      },
      songs: {
        type: Array,
        default: [],
      },
      title: {
        type: String,
        default: ''
      },
      icon: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        scrollY: 0,
      };
    },
    computed: {
      backImg() {
        return require('@/common/image/back.svg');
      },
      bgStyle() {
        return `background-image:url(${this.bgImage})`;
      },
      bgPlay() {
        return require('@/common/image/music_play.svg');
      },
      ...mapGetters([
        'playlist',
        'firstPlay',
      ])
    },
    created() {
      this.probeType = 3;
      this.listenScroll = true;
      this.clientHeight = document.documentElement.clientHeight;
    },
    mounted() {
      this.topHeight = this.clientHeight * 0.08;
      this.bgImageHeight = this.$refs.bgImage.clientHeight;
      this.minTranslateY = -this.bgImageHeight + this.topHeight;
    },
    methods: {
      handlePlaylist() {
        if (this.playlist.length > 0) {
          this.$refs.list.$el.style.bottom = '10vh';
          this.$refs.list.$el.style.height = '50vh';
          this.$refs.list.refresh();
        }
      },
      back() {
        this.$router.back();
      },
      scroll(pos) {
        this.scrollY = pos.y;
      },
      selectItem(song, index) {
        this.selectPlay({
          list: this.songs, 
          index,
          playingState: !this.firstPlay,
        });
      },
      random() {
        this.randomPlay({
          list: this.songs,
          playingState: !this.firstPlay,
        });
      },
      ...mapActions([
        'selectPlay',
        'randomPlay',
      ]),
    },
    watch: {
      scrollY(newY) {
        const translateY = Math.max(newY, this.minTranslateY);
        let zIndex = 0;
        let scale = 1;
        let blur = 0;
        const precent = Math.abs(newY / this.bgImageHeight);
        if (newY > 0) {
          scale = 1 + precent;
          zIndex = 100;
        } else {
          blur = Math.min(20, precent * 20);
        }
        this.$refs.bgLayer.style[transform] = `translate3d(0, ${translateY}px, 0)`;
        this.$refs.filter.style[backdrop] = `blur(${blur}px)`;
        if(newY < this.minTranslateY) {
          zIndex = 100;
          this.$refs.bgImage.style.height = `${this.topHeight}px`;
          this.$refs.bgImage.style.paddingTop = 0;
          this.$refs.playBtn.style.display = 'none';
        } else {
          this.$refs.bgImage.style.height = 0;
          this.$refs.bgImage.style.paddingTop = '40vh';
          this.$refs.playBtn.style.display = '';
        }
        this.$refs.bgImage.style[transform] = `scale(${scale})`
        this.$refs.bgImage.style.zIndex = zIndex;
      },
    },
    components: {
      Scroll,
      SongList,
      Loading,
    }
  }
</script>

<style scoped>
  .music-list {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: var(--color-background);
  }

  .music-list-top {
    position: absolute;
    width: 100%;
    height: 4vh;
    z-index: 110;
    top: 2vh;
    display: flex;
    justify-content: center;
  }
  .music-list-back {
    position: absolute;
    top: 0;
    left: 3vw;
    z-index: 120;
    height: 4vh;
  }
  .music-list-title {
    font-size: 3vh;
    margin: 0;

    text-align: center;
    color: var(--color-text);
    width: 70%;
    white-space:nowrap;
    word-break:keep-all;
    overflow:hidden;
    text-overflow:ellipsis;
  }
  .music-list-img {
    width: 100%;
    background-size: cover;
    padding-top: 40vh;
    position: relative;
    transform-origin: top;
  }
  .play {
    position: absolute;
    left: 50%;
    bottom: 2vh;
    transform: translate(-50%, 0);
    height: 5vh;
    width: 40vw;
    border-radius: 5vh;
    border: 0.3vh solid var(--color-theme);
    z-index: 50;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .icon-play {
    width: 2vh;
    height: 2vh;
    border-radius: 2vh;
    border: 0.2vh solid var(--color-theme);
    margin-right: 2vw;
  }
  .text {
    font-size: 2vh;
    color: var(--color-theme);
  }
  .filter {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(7, 17, 27, 0.2);
  }
  .bg-layer {
    width: 100%;
    height: 60vh;
    position: absolute;
    bottom: 0;
    z-index: 60;
    background: var(--color-background);
  }
  .song-list-wrapper {
    height: 60vh;
    width: 100%;
    position: absolute;
    bottom: 0;
    z-index: 70;
  }
  .loading-container {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100vw;
    transform: translate(0, -50%);
    display: flex;
    justify-content: center;
  }
</style>