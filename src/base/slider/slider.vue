<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    data() {
      return {
        
      }
    },
    mounted() {
      setTimeout(() => {
        _setSliderWidth();
        _initSlider();
      }, 20)
    },
    methods: {
      _setSliderWidth() {

      },
      _initSlider() {

      },
    }
  }
</script>

<style>

</style>
