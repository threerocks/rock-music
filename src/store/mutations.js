import * as types from './mutation-types';


const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer;
  },
  [types.SET_FIRST_PLAY](state, firstPlay) {
    state.firstPlay = firstPlay;
  },
  [types.SET_DISK](state, disk) {
    state.disk = disk;
  },
  [types.SET_RANK](state, rank) {
    state.rank = rank;
  },
  [types.SET_PLAYING_STATE](state, flag) {
    state.playing = flag;
  },
  [types.SET_FULL_SCREEN](state, flag) {
    state.fullScreen = flag;
  },
  [types.SET_PLAYLIST](state, list) {
    state.playlist = list;
  },
  [types.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list;
  },
  [types.SET_PLAY_MODE](state, mode) {
    state.mode = mode;
  },
  [types.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index;
  },
  [types.SET_SEARCH_HISTORY](state, searchHistory) {
    state.searchHistory = searchHistory;
  },
  [types.SET_MARKED_LIST](state, markedList) {
    state.markedList = markedList;
  },
};
export default mutations;