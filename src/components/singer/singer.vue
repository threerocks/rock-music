<template>
  <div class="singer">
    <list-view :data="singers"></list-view>
  </div>
</template>

<script>
import {ERR_OK} from '@/api/config';
import {getSingers} from '@/api/singer';
import {getPinyin} from '@/api/pinyin';
import Singer from '@/common/js/singer'
import ListView from '@/base/listview/listview'

const HOT_SINGER_LEN = 10;
const HOT_NAME = '热门';

export default {
  data() {
    return {
      singers: [],
    }
  },
  created() {
    this._getSingers();
  },
  methods: {
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
      const promiseList = [];
      list.map((item, index) => {
        promiseList.push(getPinyin(item.name).then((data) => {
          let fIndex = ''
          if(data && data[0] && data[0][0] && data[0][0] !== '') {
            fIndex = data[0][0].split('')[0].toUpperCase();
            const singer = new Singer({
              name: item.name,
              id: item.id,
              index: fIndex,
              pic: item.picUrl,
            });
            singerList.push(singer);
            if (index < HOT_SINGER_LEN) {
              map.hot.items.push(singer);
            }
          }
        }));
      });

      return Promise.all(promiseList).then((data) => {
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
      })
    },
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
    top: 14vh;
    bottom: 0;
  }
</style>