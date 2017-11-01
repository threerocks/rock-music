<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress-bg"></div>
      <div class="progress" ref="progress"></div>
      <div class="progress-btn" 
           ref="progressBtn"
           @touchstart.prevent="progressTouchStart" 
           @touchmove.prevent="progressTouchMove" 
           @touchend.prevent="progressTouchEnd" 
      >
      </div>
    </div>
  </div>
</template>

<script>
  import {prefixStyle} from '@/common/js/dom'

  const transform = prefixStyle('transform');

  export default {
    props: {
      precent: {
        type: Number,
        default: 0,
      }
    },
    created() {
      this.touch = {};
      this.heightFlag = false;
    },
    methods: {
      progressTouchStart(e) {
        this.touch.initiated = true;
        this.touch.startX = e.touches[0].pageX;
        this.touch.left = this.$refs.progress.clientWidth;
      },
      progressTouchMove(e) {
        if (!this.touch.initiated) return;
        const deltaX = e.touches[0].pageX - this.touch.startX;
        const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - this.$refs.progressBtn.clientWidth, 
          Math.max(0, this.touch.left + deltaX));
        this._offset(offsetWidth);
      },
      progressTouchEnd(e) {
        this.touch.initiated = false;
        this._precentChange();
      },
      progressClick(e) {
        const rect = this.$refs.progressBar.getBoundingClientRect();
        const offsetX = e.pageX - rect.left;
        this._offset(offsetX);
        this._precentChange();
      },
      _precentChange() {
        const barWidth = this.$refs.progressBar.clientWidth;
        const btnWidth = this.$refs.progressBtn.clientWidth;
        const precent = this.$refs.progress.clientWidth / (barWidth - btnWidth);
        this.$emit('precentChange', precent);
      },
      _offset(offsetWidth) {
        this.$refs.progress.style.width = `${offsetWidth}px`;
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`;
      },
    },
    watch: {
      precent(newPrecent) {
        if (this.touch.initiated) return;
        const barWidth = this.$refs.progressBar.clientWidth;
        const btnWidth = this.$refs.progressBtn.clientWidth;
        const offsetWidth = newPrecent * (barWidth - btnWidth);
        this._offset(offsetWidth);
      },
    }
  }
</script>

<style scoped>
  .progress-bar {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .progress-bg, .progress {
    width: 100%;
    height: 20%;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
  }
  .bar-inner {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .progress {
    background: var(--color-theme);
    position: absolute;
    left: 0;
    width: 0;
  }
  .progress-btn {
    height: 3vh;
    width: 3vh;
    box-sizing: border-box;
    border-radius: 50%;
    background: var(--color-theme);
    border: 0.5vmax solid var(--color-text);
    position: absolute;
    left: -1.5vh;
  }
</style>