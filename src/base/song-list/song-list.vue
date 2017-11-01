<template>
  <div class="song-list">
    <ul>
      <li @click="selectItem(song, index)" class="song-list-item" v-for="(song, index) of songs">
        <div v-show="icon" class="icon">
          <span :style="getStyle(index)">{{getText(index)}}</span>
        </div>
        <div class="song-list-content">
          <h2>{{song.name}}</h2>
          <p>{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: Boolean,
      default: false,
    },
    songs: {
      type: Array,
      default: [],
    }
  },
  methods: {
    getDesc(song) {
      return `${song.singer} - ${song.album.name}`
    },
    selectItem(song, index) {
      this.$emit('select', song, index);
    },
    getStyle(index) {
      if (index < 3) {
        const img = require(`@/common/image/rank-${index + 1}.svg`);
        return `background: url(${img}) 0% 0% / cover`
      }
      return '';
    },
    getText(index) {
      if (index < 3) return ''
      return index + 1;
    }
  }
}
</script>

<style scoped>
.song-list {
  width: 100vw;
}
.song-list-item {
  padding: 2vh 5vh;
  display: flex;
}
.song-list-content {
  width: 80%; 
}
.icon {
  width: 10vw;
  height: 10vw;
  font-size: 6vw;
  color: var(--color-theme);
  margin-right: 6vw;
}
.icon span {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: cover;
}
.song-list-content h2 {
  color: var(--color-text);
  font-size: 3.5vw;
  margin-bottom: 1vh; 
}
.song-list-content p {
  color: var(--color-text-d);
  font-size: 3.5vw;
  white-space:nowrap;
  word-break:keep-all;
  overflow:hidden;
  text-overflow:ellipsis;
}
</style>