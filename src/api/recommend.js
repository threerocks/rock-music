import {host, ERR_OK} from './config'
import axios from 'axios'

export function getRecommend() {
  const url = `${host}/banner`;

  return axios.get(url).then((res) => {
    const banners = [];
    if (res.data.code === ERR_OK) {
      for (const banner of res.data.banners) {
        if (banner.url && banner.url !== '') banners.push(banner);
      }
    }
    res.data.banners = banners;

    return Promise.resolve(res.data)
  });
}