<template>
  <transition name="singer">
    <music-list :title="title" :bgImage="bgImage" :songs="songs" class="singer-detail"></music-list>
  </transition>
</template>

<script>
import MusicList from '@/components/music-list/music-list'
import {getSingerDetail} from '@/api/singer'
import {getSongUrl} from '@/api/song'
import {ERR_OK} from '@/api/config'
import {createSong} from '@/common/js/song'
import {mapGetters} from 'vuex'

export default { 
  computed: {
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.pic
      },
    ...mapGetters([
      'singer'
    ])
  },
  data() {
    return {
      songs: [],
    };
  },
  created() {
    this._getDetail();
  },
  methods: {
    _getDetail() {
      if (!this.singer.id) {
        this.$router.push('/singer');
        return;
      }
      const self = this;
      getSingerDetail(this.singer.id).then((res) => {
        if(res.code === ERR_OK) {
          this._normalizeSongs(res.hotSongs).then((data) => {
            this.songs = data;
          });
        }
      })
    },
    _normalizeSongs(list) {
      const ret = [];
      const promiseList = [];
      list.map((item, index) => {
        promiseList.push(getSongUrl([item.id]).then((res) => {
          item.url = res.code === ERR_OK ? res.data[0].url : ''
        }));
      });
      return Promise.all(promiseList).then(() => {
        for (const song of list) {
          ret.push(createSong(song));
        }
        return ret;
      })
    },
  },
  components: {
    MusicList,
  },
}
</script>

<style scoped>
  .singer-detail {
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
  .singer-enter, .singer-leave-to {
    transform: translate3d(100%, 0, 0);
  }
  .singer-enter-active, .singer-leave-active {
    transition: all 0.1s ease-in-out
  }
</style>