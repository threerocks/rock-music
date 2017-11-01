<template>
  <scroll class="listview" 
          :data="data"
          :listen-scroll="listenScroll"
          :probe-type="probeType"
          @scroll="scroll"
          ref="listview">
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" class="list-group-item" v-for="item in group.items">
            <img class="singer-avatar" v-lazy="item.pic">
            <span class="singer-name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" 
          @touchstart.stop.prevent="onShortcutTouchStart" 
          @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList" 
            :data-index="index" 
            class="list-shortcut-item" 
            ref="shortcutItem"
            :class="{'current': currentIndex === index}"
        >
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      {{fixedTitle}}
    </div>
    <div v-show="!data.length" class="loading-container">
      <loading></loading>
    </div>
  </scroll>
</template>

<script>
  import Scroll from '@/base/scroll/scroll';
  import Loading from '@/base/loading/loading';
  import {getData} from '@/common/js/dom';

  export default {
    props: {
      data: {
        type: Array,
        default: [],
      },
    },
    created() {
      this.touch = {};
      this.probeType = 3;
      this.listenScroll = true;
      this.listHeight = [];
      this.titleHeight = 0;
      this.anchorHeight = 0;
    },
    data() {
      return {
        currentIndex: 0,
        scrollY: -1,
        diff: -1,
      }
    },
    computed: {
      shortcutList() {
        return this.data.map((group) => {
          return group.title.substr(0, 1);
        })
      },
      fixedTitle() {
        if (this.scrollY > 0){
          return '';
        };
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : '';
      }
    },
    components: {
      Scroll,
      Loading,
    },
    methods: {
      selectItem(item) {
        this.$emit('select', item);
      },
      onShortcutTouchStart(e) {
        let anchorIndex = getData(e.target, 'index');
        let firstTouch = e.touches[0];
        this.touch.y1 = firstTouch.pageY;
        this.touch.anchorIndex = anchorIndex;
        this._scrollTo(anchorIndex);
      },
      onShortcutTouchMove(e) {
        if (!this.anchorHeight) this.anchorHeight = this.$refs.shortcutItem[0].clientHeight;
        let firstTouch = e.touches[0];
        this.touch.y2 = firstTouch.pageY;
        const delta = (this.touch.y2 - this.touch.y1) / this.anchorHeight | 0;
        const anchorIndex = parseInt(this.touch.anchorIndex, 10) + delta;
        this._scrollTo(anchorIndex);
      },
      scroll(pos) {
        this.scrollY = pos.y;
      },
      refresh() {
        this.$refs.listview.refresh();
      },
      _calculateHeight() {
        this.listHeight = [];
        const list = this.$refs.listGroup;
        let height = 0;
        this.listHeight.push(height);
        for (const item of list) {
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      },
      _scrollTo(index) {
        if (!index || index === 0) return;
        if (index < 0) index = 0;
        this.scrollY = -this.listHeight[index];
        this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0);
      },
    },
    watch: {
      data() {
        setTimeout(() => {
          this._calculateHeight();
        }, 20)
      },
      scrollY(newY) {
        const listHeight = this.listHeight;
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i];
          let height2 = listHeight[i + 1];
          if (height2 && -newY >= height1 && -newY < height2) {
            this.currentIndex = i;
            this.diff = height2 + newY;
            return;
          }
        }
      },
      diff(newVal) {
        if (!this.titleHeight) this.titleHeight = this.$refs.fixed.clientHeight;
        let fixedTop = (newVal > 0 && newVal < this.titleHeight) ? newVal - this.titleHeight : 0;
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    }
  }
</script>

<style>
  .listview {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .list-group {
    padding-bottom: 3vh;
  }
  .list-group-title {
    height: 4vh;
    line-height: 4vh;
    padding-left: 7vw;
    font-size: 2.3vh;
    background: var(--color-highlight-background);
    color: var(--color-text-l);
  }
  .list-group-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 3vh 0 0 7vw;
  }
  .singer-avatar {
    border-radius: 50%;
    width: 13vw;
    height: 13vw;
    object-fit: cover;
  }
  .singer-name {
    margin-left: 5vw;
    color: var(--color-text-l);
    font-size: 4vw;
  }
  .list-shortcut {
    position: absolute;
    top: 50%;
    right: 1%;
    border-radius: 10px;
    transform: translate(0, -50%);
    background: var(--color-background-d)
  }
  .list-shortcut ul {
    list-style: none;
  }
  .list-shortcut-item {
    padding: 0.5vh;
    line-height: 1;
    text-align: center;
    color: var(--color-text-l);
    font-size: 2vh;
  }
  .current {
    color: var(--color-theme);
    font-weight: bold;
  }
  .list-fixed {
    position: absolute;
    top: 0;
    width: 100%;
    height: 4vh;
    line-height: 4vh;
    padding-left: 7vw;
    font-size: 2.3vh;
    font-weight: bold;
    background: var(--color-highlight-background);
    color: var(--color-text-l);
  }
  .loading-container {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
