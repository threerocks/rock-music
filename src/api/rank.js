import {host, rankIds, ERR_OK} from './config'
import {createSongForRank} from '../common/js/song'
import axios from 'axios'

export const getRankList = function() {
  const promises = [];
  for (const id of rankIds) {
    const url = `${host}/top/list?idx=${id}`;
    promises.push(axios.get(url).then((res) => {
      if (res.data && Object.prototype.toString.call(res.data.result) === '[object Object]') {
        return res.data;
      } else {
        return JSON.parse(res.data[id]);
      }
    }));
  }
  return Promise.all(promises).then((resList) => {
    const rankList = [];
    for (const res of resList) {
      if (res && res.code !== ERR_OK) Promise.reject(new Error(res.data));
      rankList.push(createRank(res.result));
    }
    return Promise.resolve(rankList);
  })
}

class Rank {
  constructor({id, name, image, description, songs}) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.description = description;
    this.songs = songs;
  }
}

function createRank(rank) {
  const songs = [];
  for (const song of rank.tracks) {
    songs.push(createSongForRank(song));
  }
  return new Rank({
    id: rank.id,
    name: rank.name,
    image: rank.coverImgUrl,
    description: rank.description,
    songs,
  })
}