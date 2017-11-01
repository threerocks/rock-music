<template>
  <transition name="rank">
    <music-list :icon="icon" :title="title" :bgImage="bgImage" :songs="songs" class="rank-detail"></music-list>
  </transition>
</template>

<script>
import MusicList from '@/components/music-list/music-list'
import {getSongUrl} from '@/api/song'
import {ERR_OK} from '@/api/config'
import {mapGetters} from 'vuex'

export default { 
  computed: {
      title() {
        return this.rank.name
      },
      bgImage() {
        return this.rank.image
      },
    ...mapGetters([
      'rank'
    ])
  },
  data() {
    return {
      songs: [],
      icon: true,
    };
  },
  mounted() {
    if (!this.rank.id) {
      this.$router.push('/rank');
      return;
    }
    const list = JSON.parse(JSON.stringify((this.rank.songs)));
    this._normalizeSongs(list);
  },
  methods: {
    _normalizeSongs(list) {
      const promiseList = [];
      list.map((item, index) => {
        promiseList.push(getSongUrl([item.id]).then((res) => {
          item.url = res.code === ERR_OK ? res.data[0].url : ''
        }));
      });
      Promise.all(promiseList).then(() => {
        this.songs = list;
      })
    },
  },
  components: {
    MusicList,
  },
}
</script>

<style scoped>
  .rank-detail {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    background: var(--color-background)
  }
  .rank-enter, .rank-leave-to {
    transform: translate3d(100%, 0, 0);
  }
  .rank-enter-active, .rank-leave-active {
    transition: all 0.1s ease-in-out
  }
</style>