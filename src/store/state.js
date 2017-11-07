import {playMode} from '@/common/js/config'
import {getSearch, getMarked} from '@/common/js/cache'

const state = {
  singer: {},
  firstPlay: true,
  disk: {},
  rank: {},
  playing: false,
  fullScreen: false,
  playlist: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  searchHistory: getSearch(),
  markedList: getMarked(),
}

export default state