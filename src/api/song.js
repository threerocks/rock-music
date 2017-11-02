import {host} from './config'
import axios from 'axios'

export const getSongDetail = function(id) {
  const url = `${host}/song/detail?ids=${id}`;

  return axios.get(url).then((res) => {
    return Promise.resolve(res.data);
  });
}

export const getSongUrl = function(ids) {
  if (!Array.isArray(ids)) throw new Error('params is not a array');
  const url = `${host}/music/url?id=${ids.join(',')}`;

  return axios.get(url).then((res) => {
    return res.data;
  });
}

export const getLyric = function(id) {
  const url = `${host}/lyric?id=${id}`;

  return axios.get(url).then((res) => {
    return res.data;
  });
}