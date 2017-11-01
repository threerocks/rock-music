import {host, ERR_OK} from './config'
import axios from 'axios'

export function getSingers() {
  const url = `${host}/top/artists?offset=0&limit=300`;

  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  });
}

export function getSingerDetail(id) {
  const url = `${host}/artists?id=${id}`;

  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  });
}