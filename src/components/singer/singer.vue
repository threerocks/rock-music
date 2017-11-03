<template>
  <div class="singer" ref="singer">
    <list-view @select="selectSinger" :data="singers" ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import {ERR_OK} from '@/api/config';
import {getSingers} from '@/api/singer';
import Singer from '@/common/js/singer'
import ListView from '@/base/listview/listview'
import {mapGetters, mapMutations} from 'vuex'
import {playlistMixin} from '@/common/js/mixin'

const HOT_SINGER_LEN = 10;
const HOT_NAME = '热门';

export default {
  mixins: [playlistMixin],
  data() {
    return {
      singers: [],
    }
  },
  created() {
    this._getSingers();
  },
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  methods: {
    handlePlaylist() {
      if (this.playlist.length > 0) {
        this.$refs.singer.style.bottom = '10vh';
        this.$refs.list.refresh()
      }
    },
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`,
      });
      this.setSinger(singer);
    },
    _getSingers() {
      getSingers().then((data) => {
        if (data.code === ERR_OK) {
          this._normalizeSinger(data.artists).then((data) => {
            this.singers = data;
          });
        }
      });
    },
    _normalizeSinger(list) {
      const map = {
        hot: {
          title: HOT_NAME,
          items: [],
        }
      };
      const singerList = [];
      list.map((item, index) => {
        const singer = new Singer({
          name: item.name,
          id: item.id,
          index: item.fIndex,
          pic: item.picUrl,
        });
        singerList.push(singer);
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(singer);
        }
      });
      singerList.map((item, index) => {
        const key = item.index;
        if (!map[key]) {
          map[key] = {
            title: key,
            items: [],
          }
        }
        map[key].items.push(item);
      });
      const ret = [];
      const hot = [];
      for (const key of Object.keys(map)) {
        const val = map[key];
        if (val.title === HOT_NAME) {
          hot.push(val);
        } else {
          ret.push(val);
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return Promise.resolve(hot.concat(ret));
    },
    ...mapMutations({
      setSinger: 'SET_SINGER',
    })
  },
  components: {
    ListView,
  },
}
</script>

<style>
  .singer {
    position: fixed;
    width: 100%;
    top: 11.5vh;
    bottom: 0;
  }
</style>