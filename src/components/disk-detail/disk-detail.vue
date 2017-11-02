<template>
  <transition name="playlist">
    <music-list :title="title" :bgImage="bgImage" :songs="songs" class="playlist-detail"></music-list>
  </transition>
</template>

<script>
import MusicList from '@/components/music-list/music-list'
import {getPlaylistDetail} from '@/api/recommend'
import {createSong} from '@/common/js/song'
import {getSongUrl} from '@/api/song'
import {ERR_OK} from '@/api/config'
import {mapGetters} from 'vuex'

export default { 
  computed: {
      title() {
        return this.disk.name
      },
      bgImage() {
        return this.disk.image
      },
    ...mapGetters([
      'disk'
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
      if (!this.disk.id) {
        this.$router.push('/recommend');
        return;
      }
      const self = this;
      getPlaylistDetail(this.disk.id).then((res) => {
        if(res.code === ERR_OK) {
          this._normalizeSongs(res.playlist.tracks).then((data) => {
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
  .playlist-detail {
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
  .playlist-enter, .playlist-leave-to {
    transform: translate3d(100%, 0, 0);
  }
  .playlist-enter-active, .playlist-leave-active {
    transition: all 0.1s ease-in-out
  }
</style>