import {host, ERR_OK} from './config'
import axios from 'axios'

export function getRecommend() {
  const url = `${host}/banner`;

  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  });
}

export function getDiscList() {
  const url = `${host}/top/playlist?limit=20&order=hot`;

  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  });
}

export function getPlaylistDetail(id) {
  const url = `${host}/playlist/detail?id=${id}`;

  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  });
}
