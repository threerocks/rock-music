<template>
  <div ref="blurBg" class="blur-img">
    <div class="blur"></div>
  </div>
</template>

<script>
  import {prefixStyle} from '@/common/js/dom'
  const filter = prefixStyle('filter');

  export default {
    props: {
      url: {
        type: String,
        default: '',
      },
    },
    watch: {
      url(newUrl) {
        this.$refs.blurBg.style.background = `url(${this.url})`;
        this.$refs.blurBg.style.backgroundSize = 'cover';
        if(!/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
          this.$refs.blurBg.style[filter] = 'blur(10px)';
        }
      }
    }
  }
</script>

<style scoped>
  .blur-img {
    width: 100%;
    height: 100%;
  }
  .blur {
    width: 100%;
    height: 100%;
    background: rgba(7, 17, 27, 0.4);
    backdrop-filter: blur(10px);
  }
</style>