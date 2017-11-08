<template>
  <div class="player" v-show="playlist.length > 0">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave"
    >
      <div class="normal" v-show="fullScreen">
        <div class="background">
          <blur-img :url="this.currentSong.image"></blur-img>
        </div>
        <img :src="getBackIcon" class="back" @click="back">
        <div class="top">
          <h1>{{this.currentSong.name}}</h1>
          <h2>{{this.currentSong.singer}}</h2>
        </div> 
        <div class="middle">
          <div class="normal-wrapper">
            <!-- <slider :loop="loop" :autoPlay="autoPlay" :initFlag="flag" class="normal-slider" @touchmove.stop> -->
            <div class="normal-slider" 
                  @touchstart.prevent="touchstart"
                  @touchmove.prevent="touchmove"
                  @touchend.prevent="touchend"
            >  
              <div class="middle-l" ref="middleL">
                <div class="normal-img-wrapper" ref="normalImgWrapper">
                  <img :src="this.currentSong.image" ref="normalCD" :class="cdCls">
                </div>
                <p class="cd-lyric">{{playingLyric}}</p>
              </div>
              <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
                <div class="lyric-wrapper">
                  <div v-if="currentLyric">
                    <p ref="lyricLine"
                        class="lyric-text" 
                        :class="{'current': currentLineNum === index}" 
                        v-for="(line, index) in currentLyric.lines">{{line.txt}}</p>
                  </div>
                </div>
              </scroll>
            </div>
            <div class="dots">
              <i class="dot" :class="{'active': currentMiddlePage === 'cd'}"></i>
              <i class="dot" :class="{'active': currentMiddlePage === 'lyric'}"></i>
            </div>
            <!-- </slider> -->
          </div>
        </div>
        <div class="bottom">
          <div class="progress-wrapper">
            <p>{{format(currentTime)}}</p>
            <div class="progress-bar-wrapper">
              <progress-bar :precent="precent" @precentChange="precentChange"></progress-bar>
            </div>
            <p>{{format(currentSong.duration / 1000)}}</p>
          </div>
          <div class="operators">
            <img :src="modeIcon" class="mode" @click="toggleMode">
            <img :src="previousIcon" @click="prev">
            <div class="play" @click="togglePlaying">
              <img :src="playIcon">
            </div>
            <img :src="nextIcon" @click="next">
            <img :src="storeIcon" class="store" @click="store">
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini" :data="fullScreen" v-show="!fullScreen" @click="open">
        <div ref="miniWrapper">
          <img :src="this.currentSong.image" class="mini-image" ref="miniCD" :class="cdCls">
        </div>
        <div class="mini-info">
          <h1>{{this.currentSong.name}}</h1>
          <h2>{{this.currentSong.singer}}</h2>
        </div>
        <progress-circle :radius="radius" :precent="precent">
          <img :src="playIcon" class="mini-play-icon" @click.stop="togglePlaying">
        </progress-circle>
        <img :src="musicList" class="mini-list" @click.stop="clickPlayerList">
      </div>
    </transition>
    <audio ref="audio" 
            :src="currentSong.url"
            @canplay="ready"
            @error="error" 
            @timeupdate="updateTime" 
            @ended="end"
    ></audio>
    <player-list class="player-list" :playlist="playlist" ref="playerList"></player-list>
  </div>
</template>

<script>
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import animations from 'create-keyframe-animation'
  import {prefixStyle, whichTransitionEvent, addClass, rmClass} from '@/common/js/dom'
  import {playMode} from '@/common/js/config'
  import {shuffle} from '@/common/js/util'
  import Lyric from 'lyric-parser'
  import BlurImg from '@/base/blur-img/blur-img'
  import ProgressBar from '@/base/progress-bar/progress-bar'
  import ProgressCircle from '@/base/progress-circle/progress-circle'
  import {getLyric} from '@/api/song'
  import {ERR_OK} from '@/api/config'
  import Scroll from '@/base/scroll/scroll'
  import Slider from '@/base/slider/slider'
  import PlayerList from '@/components/player-list/player-list'

  const transform = prefixStyle('transform');
  const animationPlayState = prefixStyle('animationPlayState');
  const animation = prefixStyle('animation');

  export default {
    data() {
      return {
        songReady: false,
        currentTime: 0,
        cdTransform: '',
        precent: 0,
        radius: '6vh',
        currentLyric: null,
        loop: false,
        autoPlay: false,
        flag: false,
        currentLineNum: 0,
        playingLyric: '',
        currentMiddlePage: 'cd',
      };
    },
    created() {
      this.isIOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
      this.touch = {};
      this.canPlay = false;
    },
    mounted() {

    },
    computed: {
      getBackIcon() {
        return require('@/common/image/down.svg');
      },
      modeIcon() {
        if (this.mode === playMode.loop) return require('@/common/image/loop.svg');
        if (this.mode === playMode.sequence) return require('@/common/image/list.svg');
        if (this.mode === playMode.random) return require('@/common/image/random.svg');
      },
      nextIcon() {
        return require('@/common/image/music_next.svg')
      },
      playIcon() {
        return this.playing ? require('@/common/image/music_play.svg') : require('@/common/image/music_pause.svg')
      },
      previousIcon() {
        return require('@/common/image/music_previous.svg')
      },
      storeIcon() {
        return this.markedList.includes(this.currentSong.id + '') ? require('@/common/image/star.png') : require('@/common/image/star.svg')
      },
      musicList() {
        return require('@/common/image/song_list.svg')
      },
      cdCls() {
        return this.isIOS ? '' : this.playing ? 'rotate-play' : 'rotate-play rotate-paused';
      },
      ...mapGetters([
        'currentIndex',
        'currentSong',
        'fullScreen',
        'sequenceList',
        'playlist',
        'playing',
        'mode',
        'firstPlay',
        'markedList'
      ]),
    },
    methods: {
      // playerTouchstart() {
      //   if (this.$refs.audio && this.firstPlay) {
      //     this.$refs.audio.play();
      //     this.setFirstPlay(false);
      //   }
      // },
      clickPlayerList() {
        this.$refs.playerList.display();
      },
      getPrecent(currentTime) {
        this.precent = currentTime / (this.currentSong.duration / 1000);
      },
      back(e) {
        this.clickTransition(e.target);
        this.setFullScreen(false);
      },
      open(e) {
        this.setFullScreen(true);
        this.getPrecent(this.currentTime + 1 / 100000);
      },
      prev(e) {
        if(!this.songReady) return;
        this.clickTransition(e.target);
        if (this.playlist.length === 1) {
          this.loop();
          return;
        } else {
          let index = this.currentIndex - 1;
          if (index === -1) {
            index = this.playlist.length - 1;
          }
          this.setCurrentIndex(index);
          if (!this.playing) {
            this.togglePlaying();
          }
        }
        this.songReady = false;
      },
      next(e) {
        if(!this.songReady) return;
        if (e) this.clickTransition(e.target);
        if (this.playlist.length === 1) {
          this.loop();
          return;
        } else {
          let index = this.currentIndex + 1;
          if (index === this.playlist.length) {
            index = 0;
          }
          this.setCurrentIndex(index);
          if (!this.playing) {
            this.togglePlaying();
          }
        }

        this.songReady = false;
      },
      store(e) {
        if (e) this.clickTransition(e.target);
        if (this.markedList.includes(this.currentSong.id + '')) this.deleteMarkedList(this.currentSong);
        else this.saveMarkedList(this.currentSong);
      },
      end() {
        if (this.mode === playMode.loop) {
          this.playerLoop();
        } else {
          this.next();
        }
      },
      playerLoop(){
        this.$refs.audio.currentTime = 0;
        this.$refs.audio.play();
        if (this.currentLyric) {
          this.currentLyric.seek(0);
        }
      },
      toggleMode(e) {
        this.clickTransition(e.target);
        let mode = (this.mode + 1) % 3;
        this.setPlayMode(mode);
        let list = null;
        if (this.mode === playMode.random) {
          list = shuffle(this.sequenceList);
        } else {
          list = this.sequenceList;
        }
        this.resetCurrentIndex(list);
        this.setPlaylist(list);
      },
      resetCurrentIndex(list) {
        const index =  list.findIndex((item) => {
          return item.id === this.currentSong.id;
        });
        this.setCurrentIndex(index);
      },
      togglePlaying(e) {
        if (this.$refs.audio && this.firstPlay) {
          this.$refs.audio.play();
          this.setFirstPlay(false);
        }
        if(!this.songReady && !this.firstPlay) return;
        if(e) {
          this.clickTransition(e.target);
        }
        this.setPlayingState(!this.playing);
      },
      setPlaying(playing) {
        const normalImg = this.$refs.normalCD; 
        const miniImg = this.$refs.miniCD;
        const normalImgWrapper = this.$refs.normalImgWrapper; 
        const miniWrapper = this.$refs.miniWrapper; 
        if (playing) {
          addClass(normalImg, 'rotate-play');
          addClass(miniImg, 'rotate-play');
        } else {
          this._toggleRotate(normalImg, normalImgWrapper);
          this._toggleRotate(miniImg, miniWrapper);
          rmClass(normalImg, 'rotate-play')
          rmClass(miniImg, 'rotate-play')
        }
      },
      clickTransition(el) {
        addClass(el, 'click');
        el.addEventListener('animationend', () => {
          rmClass(el, 'click');
        })
      },
      precentChange(precent) {
        const cureentTime = precent * this.currentSong.duration;
        this.$refs.audio.currentTime = cureentTime / 1000;
        if (this.currentLyric) {
          this.currentLyric.seek(cureentTime); // 单位是毫秒
        }
        if (!this.playing) {
          this.togglePlaying();
        }
      },
      ready() {
        this.songReady = true;
      },
      error() {
        this.songReady = true;
      },
      enter(el, done) {
        const {x, y, scale} = this._getPosAndScale();
        this.$refs.normalImgWrapper.style[transform] = 'rotate(0)';
        let animation = {
          0: {
            transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
          },
          60: {
            transform: `translate3d(0, 0, 0) scale(1.1)`,
          },
          100: {
            transform: `translate3d(0, 0, 0) scale(1)`,
          },
        };

        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear',
          },
        });
        animations.runAnimation(this.$refs.normalCD, 'move', done);
      },
      afterEnter() {
        animations.unregisterAnimation('move');
        this.$refs.normalCD.style.animation = '';
      },
      leave(el, done) {
        const time = 0.4;
        this.$refs.normalCD.style.transition = `all ${time}s`;
        const {x, y, scale} = this._getPosAndScale();
        this.$refs.normalCD.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
        setTimeout(done, time * 1000);
      },
      afterLeave() {
        this.$refs.normalCD.style.transition = '';
        this.$refs.normalCD.style[transform] = '';
      },
      updateTime(e) {
        this.currentTime = e.target.currentTime;
      },
      getLyric() {
        getLyric(this.currentSong.id).then((data) => {
          if (data.code !== ERR_OK) return;
          this.currentLyric = new Lyric(data.lrc.lyric, this.handleLyric);
          if (this.playing) {
            this.currentLyric.play()
          }
        }).catch(e => {
          this.currentLyric = null;
          this.playingLyric = '';
          this.currentLineNum = 0;
        })
      },
      handleLyric({lineNum, txt}) {
        this.currentLineNum = lineNum;
        if (lineNum > 5) {
          let el = this.$refs.lyricLine[lineNum - 5];
          this.$refs.lyricList.scrollToElement(el, 1000);
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000);
        }
        this.playingLyric = txt;
      },
      format(interval){
        interval = interval | 0;
        const minute = interval / 60 | 0;
        const second = this._pad(interval % 60);

        return `${minute}:${second}`;
      },
      touchstart (e){
        this.touch.init = true;
        this.touch.startX = e.touches[0].pageX;
        this.touch.startY = e.touches[0].pageY;
      },
      touchmove (e) {
        if (!this.touch.init) return;
        const deltaX = e.touches[0].pageX - this.touch.startX;
        const deltaY = e.touches[0].pageY - this.touch.startY;
        if (Math.abs(deltaX) < Math.abs(deltaY)) return;
        const left = this.currentMiddlePage === 'cd' ? 0 : -window.innerWidth;
        const offsetWidth = Math.min(Math.max(left + deltaX, -window.innerWidth), 0);
        this.touch.precent = Math.abs(offsetWidth / window.innerWidth);
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`;
        this.$refs.middleL.style.opacity = 1 - this.touch.precent;
        this.$refs.middleL.style.transition = `all`;
      },
      touchend () {
        let offsetWidth = 0;
        let opacity = 0;
        if (this.currentMiddlePage === 'cd') {
          if (this.touch.precent > 0.1) {
            offsetWidth = -window.innerWidth;
            opacity = 0;
            this.currentMiddlePage = 'lyric';
          } else {
            offsetWidth = 0;
            opacity = 1;
          }
        } else {
          if (this.touch.precent < 0.9) {
            offsetWidth = 0;
            opacity = 1;
            this.currentMiddlePage = 'cd';
          } else {
            offsetWidth = -window.innerWidth;
            opacity = 0;
          }
        }
        const time = 0.3;

        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`;
        this.$refs.lyricList.$el.style.transition = `all ${time}s`;
        this.$refs.middleL.style.opacity = opacity;
        this.$refs.middleL.style.transition = `all ${time}s`;
        this.touch.init = false;
      },
      _toggleRotate(img, wrapper) {
        const imgTransform = getComputedStyle(img).transform;
        const wpTransform = getComputedStyle(wrapper).transform;
        wrapper.style.transform = wpTransform === 'none'
          ? imgTransform
          : imgTransform.concat(' ', wpTransform);
      },
      _pad(num, n = 2) {
        let len = num.toString().length;
        while (len < n) {
          num = '0' + num;
          len++;
        }

        return num;
      },
      _getPosAndScale() {
        const paddingLeft = this.$refs.miniCD.offsetLeft;
        const paddingTop = this.$refs.miniCD.offsetTop;
        const targetWidth = this.$refs.miniCD.clientWidth;

        const width = window.innerWidth * 0.8;
        const top = this.$refs.normalCD.offsetTop;

        const x = -(window.innerWidth / 2 - paddingLeft - targetWidth / 2);
        const y = window.innerHeight - top - width / 2 - targetWidth / 2 - paddingTop;
        const scale = targetWidth / width;

        return {
          x,
          y,
          scale,
        }
      },
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlayingState: 'SET_PLAYING_STATE',
        setCurrentIndex: 'SET_CURRENT_INDEX',
        setSequenceList: 'SET_SEQUENCE_LIST',
        setPlaylist: 'SET_PLAYLIST',
        setPlayMode: 'SET_PLAY_MODE',
        setFirstPlay: 'SET_FIRST_PLAY'
      }),
      ...mapActions([
        'saveMarkedList',
        'deleteMarkedList',
      ]),
    },
    watch: {
      fullScreen() {
        this.flag = this.fullScreen;
      },
      currentSong(newSong, oldSong) {
        if (newSong.id === oldSong.id) return;
        if (this.currentLyric) {
          this.currentLyric.stop();
          this.currentTime = 0
          this.playingLyric = ''
          this.currentLineNum = 0
        }
        if(newSong.url === null) {
          this.songReady = true;
          return;
        }
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          if (!this.firstPlay) {
            this.$refs.audio.play();
          }
          this.getLyric();
        }, 20);
      },
      playing(newPlaying) {
        if(this.isIOS) this.setPlaying(newPlaying);
        const audio = this.$refs.audio;
        this.$nextTick(() => {
          newPlaying ? audio.play() : audio.pause();
          if(this.currentLyric) this.currentLyric.togglePlay();
        });
      },
      currentTime(newCurrentTime) {
        this.getPrecent(newCurrentTime);
      },
      firstPlay(newFirstPlay) {
        if(newFirstPlay) {
          this.$refs.audio.pause();
          if(this.currentLyric) this.currentLyric.stop();
        } else {
          this.$refs.audio.play();
          if(this.currentLyric) this.currentLyric.play();
        }
      }
    },
    components: {
      ProgressBar,
      BlurImg,
      ProgressCircle,
      Scroll,
      Slider,
      PlayerList,
    }
  }
</script>

<style scoped>
  .player {

  }
  .normal {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: var(--color-background);
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    align-items: center;
  }
  .background {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;

  }
  .background img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .background-blur {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .back {
    position: absolute;
    top: 2vh;
    left: 3vw;
    z-index: 120;
    height: 4vh;
  }
  .top {
    height: 10vh;
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
  } 
  .top h1 {
    font-size: 3vh;
    color: var(--color-text);
    font-weight: 500;
    width: 70%;
    white-space:nowrap;
    word-break:keep-all;
    overflow:hidden;
    text-overflow:ellipsis;
    text-align: center;
  }
  .top h2 {
    font-size: 2vh;
    color: var(--color-text);
    font-weight: 400;
    width: 70%;
    white-space:nowrap;
    word-break:keep-all;
    overflow:hidden;
    text-overflow:ellipsis;
    text-align: center;
  }
  .middle {
    height: 70vh;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .normal-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
  }
  .dots {
    width: 100%;
    position: absolute;
    bottom: 0;
    display: flex;
    justify-content: center;
  }
  .dot {
    width: 2.5vw;
    height: 2.5vw;
    border-radius: 2.5vw;
    background: var(--color-text-l);
    transition: all 0.3s ease-in-out;
  }
  .dots i:first-child {
    margin-right: 1.5vw; 
  }
  .active {
    width: 5vw;
  }
  .normal-slider {
    width: 200%;
    height: 100%;
    position: absolute;
    display: flex;
    top: 0;
    left: 0;
  }
  .middle-l {
    width: 50%;
    height: 90%;
    height: 100%;
  }
  .middle-r {
    width: 50%;
    height: 90%;
    overflow: hidden;
    margin: 2vh 0
  }
  .lyric-wrapper {
    width: 100vw;
  }
  .lyric-text {
    color: var(--color-text-l);
    font-size: 2.3vh;
    height: 4vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .current {
    color: var(--color-theme);
    font-weight: bold;
  }
  .normal-img-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  .cd-lyric {
    width: 100vw;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    bottom: 5vh;
    font-size: 2.2vh;
    font-weight: bold;
    color: var(--color-text);
  }
  .middle img {
    width: 80vmin;
    height: 80vmin;
    box-sizing: border-box;
    border-radius: 50%;
    border: 1.5vh solid rgba(255, 255, 255, 0.1);    
  }
  .rotate-play {
    animation: rotate 20s linear infinite;
  }
  .rotate-paused {
    animation-play-state: paused;
  }
  .bottom {
    width: 100%;
    height: 20vh;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-around;
    align-items: center;
  }
  .operators {
    width: 100%;
    height: 50%;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .operators img {
    height: 40%;
  }

  .play {
    height: 7vh;
    width: 7vh;
    border: 2px solid var(--color-theme);
    border-radius: 50%;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .play img {
    height: 60%;
  }
  .mini-play-icon {
    position: absolute;
    height: 4vh;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
  }
  .progress-wrapper {
    width: 100%;
    height: 20%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .progress-wrapper p {
    color: var(--color-text);
    font-size: 2vh;
  }
  .progress-bar-wrapper {
    width: 65%;
    height: 100%;
    margin: 0 3vw;
  }
  .click {
    animation: click 0.4s
  }
  .rotate-play {
    animation: rotate 20s linear infinite;
  }
  .rotate-paused {
    animation-play-state: paused;
  }
  .mini {
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 10vh;
    background: var(--color-highlight-background);
  }
  .mini-image {
    width: 6vh;
    height: 6vh;
    border-radius: 50%;
  }
  .mini-info {
    width: 50%;
    height: 6vh;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-around;
    align-items: flex-start;
  }
  .mini-paly {
    height: 4vh;
    width: 4vh;
    border: 0.3vh solid var(--color-theme);
  }

  .mini-info h1, .mini-info h2 {
    white-space:nowrap;
    word-break:keep-all;
    overflow:hidden;
    text-overflow:ellipsis;
    font-size: 1.5vh;
    font-weight: 400;
    width: 100%;
  }
  .mini-info h1 {
    margin: 0;
    font-size: 2.5vh;
    font-weight: 500
  }
  .mini-list {
    height: 4vh;
  }
  .player-list {
    position: fixed;
    bottom: 0;
    z-index: 200;
  }

  .normal-enter-active, .normal-leave-active {
    transition: all 0.3s;
  }
 .normal-enter-active .top,
 .normal-leave-active .top, 
 .normal-enter-active .bottom, 
 .normal-leave-active .bottom {
    transition: all 0.3s cubic-bezier(0.86, 0.18, 0.82, 1.32);
  }
 .normal-enter, .normal-leave-to  {
    opacity: 0;
  }
  .normal-enter .top, .normal-leave-to .top {
    transform: translate3d(0, -200px, 0)
  }
  .normal-enter .bottom, .normal-leave-to .bottom {
    transform: translate3d(0, 200px, 0)
  }
  .mini-enter-active, .mini-leave-active {
    transition: all 0.3s;
  }
  .mini-enter, .mini-leave-to {
    opacity: 0;
  }

  @keyframes rotate {
    0% {transform: rotate(0);}
    100% {transform: rotate(360deg);}
  }
  @keyframes click {
    0% {transform: scale(0.8);}
    60% {transform: scale(1.5); opacity: 0;}
    100% {transform: scale(1);}
  }
</style>