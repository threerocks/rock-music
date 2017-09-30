<template>
  <div class="recommend" ref="recommend">
    <slider>
      <div v-for="item of recommends">
        <a :href="item.url">
          <img class="needsclick" :src="item.pic">
        </a>
      </div>
    </slider>
  </div>
</template>

<script>
import Slider from '@/base/slider/slider';
import {getRecommend} from '@/api/recommend.js'
import {ERR_OK} from '@/api/config'

export default {
  data() {
    return {
      recommends: [],
    }
  },
  created() {
    this._getRecommend();
  },
  methods: {
    _getRecommend() {
      getRecommend().then((res) => {
        console.log(res)
        if (res.code === ERR_OK) {
          this.recommends = res.banners;
          console.log(this.recommends)
        }
      })
    }
  },
  components: {
    Slider,
  }
}
</script>

<style>

</style>
