<template>
  <scroll class="suggest-wrapper" :data="result" ref="suggestWrapper">
    <transition name="suggest">
      <div class="suggest">
        <ul>
          <li v-for="item in result" class="suggest-item">
            <div class="item-l">
              <img :src="item.icon">
              <p>{{item.desc}}</p>
            </div>
            <div class="item-r">
              <a @click.prevent.stop="selectItem(item.type, content)" class="item-content" v-for="(content, index) in item.data" v-html="highlightKey(item.type, content, query, index)"></a>
            </div>
          </li>
        </ul>
      </div>
    </transition>
  </scroll>
</template>

<script>
  import {getSearchResult} from '@/api/search'
  import {ERR_OK, searchTypes} from '@/api/config'
  import Scroll from '@/base/scroll/scroll'
  import Singer from '@/common/js/singer'
  import {createDisk} from '@/common/js/disk'
  import {mapMutations} from 'vuex'
  import {createSongForRank} from '@/common/js/song'

  export default {
    props: {
      query: {
        type: String,
        default: '',
      }
    },
    data() {
      return {
        result: [],
      }
    },
    created() {
      
    },
    methods: {
      selectItem(type, item) {
        if (type === 'artists') {
          this.setSinger(new Singer({
            name: item.name,
            id: item.id,
            pic: item.picUrl,
          }));
          this.$router.push({
            path: `/singer/${item.id}`,
          });
        }
        if (type === 'songs') {
          
        }
        if (type === 'playlists') {
          this.setDisk(createDisk(item));
          this.$router.push({
            path: `/recommend/${item.id}`,
          });
        }
      },
      refresh() {
        this.$refs.suggestWrapper.refresh();
      },
      highlightKey(type, content, key, index) {
        const str = content.name;
        key = key.replace(/\s+/g,'');
        const regExp = new RegExp(key, 'ig');
        const newStr = str.replace(regExp, `<span style="color: var(--color-theme);">${key}</span>`);
        if (type === 'songs') {
          return `${index + 1}. ${newStr} - ${content.singer}`
        }
        return `${index + 1}. ${newStr}`
      },
      ...mapMutations({
        setSinger: 'SET_SINGER',
        setDisk: 'SET_DISK',
      }),
      _getSearchResult(query) {
        getSearchResult(query).then((res) => {
          if (res.code !== ERR_OK) return;
          this.result = this._formatResult(res.result);
        })
      },
      _formatResult(result) {
        const list = [];
        const keys = Object.keys(result);
        for (const key of keys) {
          if (key === 'artists') {
            list.push({
              type: key,
              data: result[key],
              icon: require('@/common/image/user_theme.svg'),
              desc: '歌手',
            });
          }
          if (key === 'songs') {
            for (let i = 0; i < result[key].length; i++) {
              result[key][i] = createSongForRank(result[key][i]);
            }
            list.push({
              type: key,
              data: result[key],
              icon: require('@/common/image/song.svg'),
              desc: '歌曲',
            });
          }
          if (key === 'playlists') {
            list.push({
              type: key,
              data: result[key],
              icon: require('@/common/image/album.svg'),
              desc: '歌单',
            });
          }
        }

        return list;
      },
      
    },
    watch: {
      query(newQuery) {
        this._getSearchResult(newQuery)
      }
    },
    components: {
      Scroll,
    }
  }
</script>

<style scoped>
  .suggest-wrapper {
    background: var(--color-background);
  }
  .suggest {
    width: 100%;
    height: 100%;
  }
  .suggest-item {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .suggest-item:not(:last-child) {
    border-bottom: 1vh solid var(--color-highlight-background-l);
  }
  .item-l {
    width: 20%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  .item-l::after {
    content: '';
    width: 1px;
    height: 80%;
    background: var(--color-theme);
    position: relative;
    bottom: 0;
  }
  .item-l img {
    width: 30%;
  }
  .item-l p {
    font-size: 4vw;
    font-weight: bold;
    color: var(--color-text-ll)
  }
  .item-r {
    width: 80%;
    padding: 5% 0;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
  }
  .item-content {
    font-size: 4vw;
    color: var(--color-text-l);
    line-height: 2;
    display: block;
    width: 80%;
  }

  .item-content:not(:last-child) {

  }

  .suggest-enter-active,  .suggest-leave-active {
    transition: all 3s ease-in-out;
  }
  .suggest-enter, .suggest-leave-to {
    transform: translate3d(100%, 0, 0)
  }
</style>