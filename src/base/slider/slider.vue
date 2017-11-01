<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active: currentPageIndex === index}" v-for="(item, index) in dots"></span>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import {addClass} from '@/common/js/dom.js'

  export default {
    props: {
      loop: {
        type: Boolean,
        default: true,
      },
      autoPlay: {
        type: Boolean,
        default: true,
      },
      interval: {
        type: Number,
        default: 3000,
      },
      initFlag: {
        type: Boolean,
        default: false,
      }
    },
    data() {
      return {
        dots: [],
        currentPageIndex: 0,
      }
    },
    mounted() {
      setTimeout(() => {
        this.init();
        if (this.autoPlay) {
          this._play();
        }
      }, 20); // 浏览器刷新时间17ms

      window.addEventListener('resize', () => {
        if (!this.slider) return;
        this._setSliderWidth();
        this.slider.refresh();
      });
    },
    destroyed() {
      clearTimeout(this.timer)
    },
    methods: {
      init() {
        this._setSliderWidth();
        this._initDots();
        this._initSlider();
      },
      _setSliderWidth() {
        this.children = this.$refs.sliderGroup.children;
        let width = 0;
        const sliderWidth = this.$refs.slider.clientWidth;
        for (const child of this.children) {
          child.style.width = sliderWidth + 'px'
          width += sliderWidth;
        }
        
        if (this.loop) width += 2 * sliderWidth;
        this.$refs.sliderGroup.style.width = width + 'px';
      },
      _initDots() {
        this.dots = new Array(this.children.length)
      },
      _initSlider() {
        this.slider = new BScroll(this.$refs.slider, {
          scrollX: true,
          scrollY: false,
          momentum: false,
          snap: {
            loop: this.loop,
            threshold: 0.3,
            speed: 400
          },
          click: this.click,
        });
        this.slider.on('scrollEnd', () => {
          let pageIndex = this.slider.getCurrentPage().pageX;
          if (this.loop) {
            pageIndex -= 1;
          }
          this.currentPageIndex = pageIndex;
          if (this.autoPlay) {
            this._play()
          }
        })
        this.slider.on('beforeScrollStart', () => {
          if (this.autoPlay) {
            clearTimeout(this.timer);
          }
        })
      },
      _play() {
        let pageIndex = this.currentPageIndex + 1;
        if (this.loop) {
          pageIndex += 1;
        }
        this.timer = setTimeout(() => {
          this.slider.goToPage(pageIndex, 0, 400);
        }, this.interval);
      },
    },
    watch: {
      initFlag() {
        this.init();
        this.slider.refresh();
      }
    },
  }
</script>

<style>
:root {
  --dot-width: 2vw;
}
.slider-group, .slider-group a, .slider-group img {
  width: 100%;
}
.slider-group {
  display: flex;
  height: 100%;
}
.slider {
  position: relative;
}

.dots {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  bottom: 12px;
}
.dot {
  width: var(--dot-width);
  height: var(--dot-width);
  border-radius: var(--dot-width);
  background: var(--color-text-l);
}
.dot:not(:last-child) {
  margin-right: var(--dot-width);
}
.active {
  width: calc(var(--dot-width) * 2);
  background: var(--color-text-ll);
}
</style>
