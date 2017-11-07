<template>
  <div class="personal-wrapper">
    <div class="top">
      <img :src="backIcon" @click="back" class="backIcon">
      <div class="tab-wrapper">
        <p class="tab-text" :class="{'tab-active': tab === 'marked'}" @click="selectMarked">我的收藏</p>
        <p class="tab-text" :class="{'tab-active': tab === 'about'}" @click="selectAbout">关于App</p>
      </div>
    </div>
    <div class="middle">
      <div class="middle-wrapper">
        <div class="middle-left middle-trans" v-show="tab === 'marked'">
          <div class="no-marked" v-if="!songList.length">你暂时没有收藏歌曲</div>
          <div class="random-play" v-show="songList.length" @click="random">
            <img class="random-icon-play" :src="bgPlay">
            <span class="random-text">随机播放全部</span>
          </div>
          <scroll class="middle-content-wrapper" :data="songList && [tab]">
            <ul>
              <li v-for="(song, index) in songList" class="marked-item" @click="selectItem(song, index)">
                <div class="marked-item-text">
                  <h1>{{song.name}}</h1>
                  <h2 v-text="songInfo(song)"></h2>
                </div>
                <img :src="store(song)" @click.stop="storeItem(song)">
              </li>
            </ul>
          </scroll>
        </div>
        <div class="middle-right middle-trans" v-show="tab === 'about'">
          <h1>石头音乐</h1>
          <p><span>简介：</span><br/>石头音乐是我使用vue.js做的一个音乐播放器，目前已经部署在阿里云，欢迎各位大大把玩。</p>
          <p><span>目标：</span><br/>高仿系列更贴近实际项目，能够从中学习工作经验，思考方式，编码习惯，编程技巧等等。</p>
          <p><span>技术：</span><br/>vue全家桶、html/css、flex、better-scroll、axios、nodejs、es6、localstorage、webpack等等</p>
          <p><span>素材来源：</span>Alibaba矢量图标库</p>
          <p><span>数据来源：</span>网易云音乐</p>
          <p><span>参考项目：</span>慕课网实战课 - 独立开发专属音乐WebAPP</p>
          <p><span>不足：</span>ios移动端限制自动播放，设置第一次进入播放为暂停状态</p>
          <h1>作者简介</h1>
          <p><span>昵称：</span>小磊</p>
          <p><span>域名：</span>threerocks.cn</p>
          <p><span>邮箱：</span>196887298@qq.com</p>
          <p><span>教育：</span>北方工业大学 13届软件工程专业 硕士研究生</p>
          <p><span>工作：</span>智课教育（Nodejs开发工程师） -- 艾德睿智（全栈开发工程师）</p>
          <p><span>技能：</span>web网站开发，前后端技能掌握</p>
          <p><span>github: </span>https://github.com/threerocks/rock-music</p>
          <p></p>
        </div>
      </div>
    </div>
    <div class="bottom">
      <h2>rock-music © 2017+ threerock.cn 版权所有</h2>
      <h2>联系方式：196887298@qq.com</h2>
      <h2>域名：threerock.cn</h2>
    </div>
  </div>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex';
  import {getSongDetail, getSongUrl} from '@/api/song'
  import {ERR_OK} from '@/api/config'
  import {createSong} from '@/common/js/song'
  import Scroll from '@/base/scroll/scroll'

  export default {
    data() {
      return {
        tab: 'marked',
        songList: [],
      }
    },
    computed: {
      backIcon () {
        return require('@/common/image/back.svg')
      },
      bgPlay() {
        return require('@/common/image/music_play.svg');
      },
      ...mapGetters([
        'markedList',
        'firstPlay',
      ])
    },
    mounted () {
      this.getSongList();
    },
    methods: {
      back() {
        this.$router.back();
      },
      store(song) {
        return this.markedList.includes(song.id + '') ? require('@/common/image/star.png') : require('@/common/image/star.svg');
      },
      selectMarked() {
        this.tab = 'marked';
      },
      selectAbout() {
        this.tab = 'about';
      },
      selectItem(song, index) {
        this.selectPlay({
          list: this.songList, 
          index,
          playingState: !this.firstPlay,
        });
      },
      random() {
        this.randomPlay({
          list: this.songList, 
          playingState: !this.firstPlay,
        });
      },
      songInfo(song) {
        return `${song.singer} - ${song.album.name}`
      },
      storeItem(song){
        if (this.markedList.includes(song.id + '')) this.deleteMarkedList(song);
        else this.saveMarkedList(song);
      },
      getSongList() {
        const songIds = this.markedList;
        const promises = [];
        for (const id of songIds) {
          promises.push(this._getSongInfo(id));
        }
        Promise.all(promises).then((res) => {
          this.songList = res;
        })
      },
      _getSongInfo(id) {
        function _getSongDetail() {
          return getSongDetail(id).then((res) => {
            if (res.code !== ERR_OK) throw new Error(res);
            return createSong(res.songs[0]);
          })
        };
        function _getSongUrl() {
          return getSongUrl([id]).then((res) => {
            if (res.code !== ERR_OK) throw new Error(res);
            return res.data[0];
          })
        };
        return Promise.all([_getSongDetail(), _getSongUrl()]).then((res) => {
          res[0].url = res[1].url;
          return Promise.resolve(res[0]);
        })
      },
      ...mapActions([
        'saveMarkedList',
        'deleteMarkedList',
        'selectPlay',
        'randomPlay',
      ])
    },
    watch: {
      markedList() {
        this.getSongList();
      }
    },
    components: {
      Scroll,
    }
  }
</script>

<style scoped>
  .personal-wrapper {
    width: 100vw;
    height: 100vh;
    background: var(--color-highlight-background);
    position: fixed;
    top: 0;
    left: 0;
  }
  .top {
    width: 100%;
    height: 10vh;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .backIcon {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 3vw;
    height: 40%;
    margin: auto;
  }
  .tab-wrapper {
    width: 50%;
    height: 40%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .tab-text {
    width: 50%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid var(--color-theme);
    color: var(--color-text-l);
    font-size: 2vh;
  }
  .tab-active {
    background: var(--color-dialog-background);
    color: var(--color-text);
  }
  .tab-text:first-child {
    border-radius: 10vh 0 0 10vh;
    border-right: none;
  }
  .tab-text:last-child {
    border-radius: 0 10vh 10vh 0;
  }
  .middle {
    width: 100%;
    height: 80vh;
  }
  .middle-wrapper {
    width: 100%;
    height: 100%;
  }
  .middle-left {
    width: 100%;
    height: 100%;
  }
  .random-play {
    height: 4vh;
    width: 35vw;
    border-radius: 2vh;
    border: 0.2vh solid var(--color-theme);
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
  }
  .random-icon-play {
    width: 2vh;
    height: 2vh;
    border-radius: 2vh;
    border: 0.2vh solid var(--color-theme);
    margin-right: 2vw;
  }
  .random-text {
    font-size: 2vh;
    color: var(--color-theme);
  }
  .middle-content-wrapper {
    width: 100%;
    height: 90%;
    overflow: hidden;
  }
  .middle-content-wrapper ul {
    list-style: none;
  }
  .marked-item {
    width: 80%;
    margin: auto;
    font-weight: 400;
    margin-top: 3vh; 
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .marked-item-text {
    width: 90%;
    height: 100%;
  }
  .marked-item > img {
    width: 10%;
  }
  .marked-item h1 {
    width: 100%;
    white-space:nowrap;
    word-break:keep-all;
    overflow:hidden;
    text-overflow:ellipsis;
    font-size: 2vh;
    color: var(--color-text);
  }
  .marked-item h2 {
    width: 100%;
    white-space:nowrap;
    word-break:keep-all;
    overflow:hidden;
    text-overflow:ellipsis;
    font-size: 2vh;
    color: var(--color-text-l);
  }
  .middle-right {
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: flex-start;
    align-items: center;
  }
  .middle-right h1 {
    width: 80%;
    margin: 2vh auto 0;
    font-size: 4vh;
    color: var(--color-text);
    text-align: center;
    /* display: flex;
    justify-content: center;
    align-items: center; */
  }
  .middle-right p {
    width: 85%;
    margin: auto;
    font-size: 2vh;
    margin: 0.5vh 0;
    color: var(--color-text-ll);
  }
  .middle-right span {
    color: var(--color-theme);
    font-size: 2.2vh;
    font-weight: 500;
  }
  .middle-trans {
    animation: middle-tab 0.4s ease-in-out;
  }
  .bottom {
    width: 100%;
    height: 10vh;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
  }
  .bottom h2 {
    height: 20%;
    font-size: 1vh;
    font-weight: 400;
    color: var(--color-text-l);
  }
  .no-marked {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 50vw;
    height: 50vh;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  @keyframes middle-tab {
    0% {opacity: 0}
    100% {opacity: 1}
  }
</style>