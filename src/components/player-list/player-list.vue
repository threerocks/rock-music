<template>
  <div class="player-list-wrapper" v-show="show">
    <div class="player-list-top" ref="top">
      <img class="player-list-back" :src="backImg" @click="back">
    </div>
    <scroll class="layer-list-scroll" :data="playlist && [show]" ref="layerListScroll">
      <ul class="player-list-content">
        <li v-for="(song, index) in playlist" class="player-list-item">
          <div class="player-list-left">
            <img :src="deleteIcon" @click="deleteSong(song, index)">
            <h2 v-text="songItem(song, index)" :class="{'play-active': index === currentIndex}" @click="selectSong(index)"></h2>
          </div>
          <img :src="store(song)" @click="storeItem(song)">
        </li>
      </ul>
    </scroll>
  </div>
</template>

<script>
  import Scroll from '@/base/scroll/scroll'
  import {mapGetters, mapActions, mapMutations} from 'vuex';

  export default {
    props: {
      playlist: {
        type: Array,
        default: [],
      },
    },
    data() {
      return {
        show: false,
      }
    },
    computed: {
      backImg() {
        return require('@/common/image/down.svg');
      },
      deleteIcon() {
        return require('@/common/image/delete.svg');
      },
      ...mapGetters([
        'currentIndex',
        'markedList',
      ]),
    },
    methods: {
      back() {
        this.show = false; 
      },
      display() {
        this.show = true; 
      },
      store(song) {
        return this.markedList.includes(song.id + '') ? require('@/common/image/star.png') : require('@/common/image/star.svg');
      },
      songItem(song, index) {
        return `${song.name} - ${song.singer}`;
      },
      deleteSong(song, index) {
        this.deleteFromList({song, index});
      },
      storeItem(song){
        if (this.markedList.includes(song.id + '')) this.deleteMarkedList(song);
        else this.saveMarkedList(song);
      },
      selectSong(index) {
        this.setCurrentIndex(index);
      },
      ...mapMutations({
        setCurrentIndex: 'SET_CURRENT_INDEX',
      }),
      ...mapActions([
        'deleteFromList',
        'saveMarkedList',
        'deleteMarkedList',
      ])
    },
    components: {
      Scroll,
    },
  }
</script>

<style scoped>
  .player-list-wrapper {
    width: 100vw;
    height: 70vh;
    background: var(--color-highlight-background);
  }
  .player-list-top {
    width: 100%;
    height: 7vh;
    position: relative;
    display: flex;
    align-items: center;
  }
  .player-list-back {
    height: 60%;
    margin-left: 2vw;
  }
  .layer-list-scroll {
    height: 63vh;
    overflow: hidden;
  }
  .player-list-content {
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    overflow: hidden;
  }
  .player-list-item {
    width: 90%;
    height: 7vh;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .player-list-left {
    height: 7vh;
    width: 80%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .player-list-left h2 {
    height: 100%;
    width: 100%;
    white-space:nowrap;
    word-break:keep-all;
    overflow:hidden;
    text-overflow:ellipsis;
    font-size: 2.5vh;
    font-weight: 400;
    line-height: 7vh;
    margin-left: 2vw;
  }
  .play-active {
    color: var(--color-theme);
    font-weight: 500 !important;
  }
  .player-list-item img, .player-list-left img {
    height: 50%;
  }
</style>