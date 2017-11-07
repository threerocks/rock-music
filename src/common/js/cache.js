const SEARCH_KEY = '__search__';
const SEARCH_MAX_LEN = 5;

const MARKED_KEY = '__marked__';

class Storage {
  constructor(storage) {
    this.storage = storage;
  }
  get(key, def) {
    if (def) {
      return this.storage[key] ? this.storage[key] : def;
    } else {
      return this.storage[key];
    }
  }
  set(key, val) {
    this.storage[key] = val;
  }
}

function insertArray(arr, val, compare, len) {
  const index = arr.findIndex(compare);
  if (index === 0) return;
  if (index > 0) {
    arr.splice(index, 1);
  }
  arr.unshift(val);
  if (len && arr.length > len) {
    arr.pop();
  }
}

export const saveSearch = function(query) {
  const storage = new Storage(localStorage);
  let search = storage.get(SEARCH_KEY, []);
  if (typeof search === 'string') search = search.split(',');

  insertArray(search, query, (item) => {
    return item === query;
  }, SEARCH_MAX_LEN);
  storage.set(SEARCH_KEY, search);

  return search;
}

export const getSearch = function(query) {
  const storage = new Storage(localStorage);
  let search = storage.get(SEARCH_KEY, []);
  if (typeof search === 'string') search = search.split(',');

  return search;
}

export const deleteSearch = function(index) {
  const storage = new Storage(localStorage);
  let search = storage.get(SEARCH_KEY, []);
  if (typeof search === 'string') search = search.split(',');
  search.splice(index, 1)
  storage.set(SEARCH_KEY, search);

  return search;
}

export const clearSearch = function(query) {
  const storage = new Storage(localStorage)
  let search = storage.get(SEARCH_KEY, []);
  search = [];

  return search
}

export const getMarked = function() {
  const storage = new Storage(localStorage);
  let markedList = storage.get(MARKED_KEY, []);
  if (typeof markedList === 'string') markedList = markedList.split(',');

  return markedList;
}

export const saveMarked = function(song) {
  const songId = song.id + '';
  const storage = new Storage(localStorage);
  let markedList = storage.get(MARKED_KEY, []);
  if (typeof markedList === 'string') markedList = markedList.split(',');
  insertArray(markedList, songId, (item) => {
    return item === songId;
  });
  storage.set(MARKED_KEY, markedList);

  return markedList;
}

export const deleteMarked = function(song) {
  const songId = song.id + '';
  const storage = new Storage(localStorage);
  let markedList = storage.get(MARKED_KEY, []);
  if (typeof markedList === 'string') markedList = markedList.split(',');
  const index = markedList.findIndex((item) => {

    
    return item === songId;
  })
  markedList.splice(index, 1)
  storage.set(MARKED_KEY, markedList);

  return markedList;
}