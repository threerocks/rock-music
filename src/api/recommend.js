import {host, ERR_OK} from './config'
import axios from 'axios'

export function getRecommend() {
  const url = `${host}/banner`;

  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  });
}

export function getDiscList() {
  const url = `${host}/personalized`;

  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  });
}