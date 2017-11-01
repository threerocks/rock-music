import {getSongUrl} from '@/api/song.js'
import {ERR_OK} from '@/api/config'

export default class Song {
  constructor({id, singer, name, album, duration, image, url}) {
    this.id = id;
    this.name = name;
    this.album = album;
    this.duration = duration;
    this.image = image;
    this.url = url;
    this.singer = singer;
  }
}

export function createSong(music) {
  return new Song({
    id: music.id,
    name: music.name,
    album: music.al,
    duration: music.dt,
    image: music.al.picUrl,
    url: music.url,
    singer: getSinger(music, 'ar'),
  })
}

export function createSongForRank(music) {
  return new Song({
    id: music.id,
    name: music.name,
    album: music.album,
    duration: music.duration,
    image: music.album.picUrl,
    url: music.url,
    singer: getSinger(music, 'artists'),
  })
}

const getSinger = function (music, artists) {
  return music[artists].map((item) => item.name).join('/');
}

