import axios from 'axios'

export function getPinyin(item) {
  const url = `/api/pingyin?item=${item}`;

  return axios.get(url).then((res) => {
    return Promise.resolve(res.data)
  });
}
