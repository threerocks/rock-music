<template>
  <div class="progress-circle">
    <svg :width="radius" :height="radius" viewBox="0 0 100 100" version="1.1">
      <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"/>
      <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="dasharray"
              :stroke-dashoffset="dashoffset"/>
    </svg>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    props: {
      radius: {
        type: String,
        default: '100px',
      },
      precent: {
        type: Number,
        default: 0,
      }
    },
    data() {
      return {
        dasharray: Math.PI * 100,
      }
    },
    computed: {
      dashoffset() {
        return (1 - this.precent) * this.dasharray;
      }
    },
  }
</script>

<style scoped>
.progress-circle {
  position: relative;
}
circle {
  stroke-width: 0.5vh;
  transform-origin: center;
}
.progress-background {
  transform: scale(0.9);
  stroke: var(--color-theme-d)
}
.progress-bar {
  transform: scale(0.9) rotate(-90deg);
  stroke: var(--color-theme)
}
</style>