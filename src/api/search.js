import {host, searchTypes} from './config'
import axios from 'axios'

export const getHotkey = function(id) {
  const url = `${host}/search/hotkey`;

  return axios.get(url).then((res) => {
    return Promise.resolve(res.data);
  });
}

export const getSearchResult = function(keywords) {
  const url = `${host}/search/suggest?keywords=${keywords}`;

  return axios.get(url).then((res) => {
    return Promise.resolve(res.data);
  });
}
