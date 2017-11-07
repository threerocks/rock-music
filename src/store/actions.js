import * as types from './mutation-types'
import {playMode} from '@/common/js/config'
import {shuffle} from '@/common/js/util'
import {saveSearch, deleteSearch, clearSearch, saveMarked, getMarked, deleteMarked} from '@/common/js/cache'

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const selectPlay = function({commit, state}, {list, index, playingState}) {
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYLIST, list);
  commit(types.SET_SEQUENCE_LIST, list);
  commit(types.SET_CURRENT_INDEX, index);
  commit(types.SET_PLAYING_STATE, playingState);
}

export const randomPlay = function({commit, state}, {list, playingState}) {
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYLIST, shuffle(list));
  commit(types.SET_SEQUENCE_LIST, list);
  commit(types.SET_CURRENT_INDEX, 0);
  commit(types.SET_PLAYING_STATE, playingState);
}

export const insertSong = function({commit, state}, song, playingState) {
  const playlist = [...state.playlist];
  const sequenceList = [...state.sequenceList];
  let currentIndex = state.currentIndex;
  const currentSong = playlist[currentIndex];
  let fpIndex = findIndex(playlist, song);
  currentIndex++;
  playlist.splice(currentIndex, 0, song);
  // 如果已经包含了这首歌
  if (fpIndex > -1) {
    if(fpIndex < currentIndex) {
      playlist.splice(fpIndex, 1);
      currentIndex--;
    } else {
      playlist.splice(fpIndex + 1, 1);
    }
  }

  const currentSIndex = findIndex(sequenceList, currentSong);
  let fsIndex = findIndex(sequenceList, song);
  sequenceList.splice(currentSIndex, 0, song);
  // 如果已经包含了这首歌
  if (fsIndex > -1) {
    if(fsIndex < currentSIndex) {
      sequenceList.splice(fsIndex, 1);
    } else {
      sequenceList.splice(fsIndex + 1, 1);
    }
  }

  commit(types.SET_PLAYLIST, playlist);
  commit(types.SET_SEQUENCE_LIST, sequenceList);
  commit(types.SET_CURRENT_INDEX, currentIndex);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, playingState);
}

export const deleteFromList = function ({commit, state}, {song, index}) {
  let currentIndex = state.currentIndex;
  let playlist = [...state.playlist];
  let sequenceList = [...state.sequenceList];
  console.log(index)
  playlist.splice(index, 1);
  if (index < currentIndex) currentIndex--;
  let fsIndex = findIndex(sequenceList, song);
  sequenceList.splice(fsIndex, 1);
  
  commit(types.SET_PLAYLIST, playlist);
  commit(types.SET_SEQUENCE_LIST, sequenceList);
  commit(types.SET_CURRENT_INDEX, currentIndex);
  // commit(types.SET_FULL_SCREEN, state.fullScreen);
  // commit(types.SET_PLAYING_STATE, state.playingState);
}


export const saveSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = function ({commit}, index) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(index))
}

export const clearSearchHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

export const saveMarkedList = function ({commit}, song) {
  commit(types.SET_MARKED_LIST, saveMarked(song));
}

export const deleteMarkedList = function ({commit}, song) {
  commit(types.SET_MARKED_LIST, deleteMarked(song));
}