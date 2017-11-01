function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const shuffle = function(arr) {
  let _arr = Array.from(arr);
  for (let i = 0; i < arr.length; i++) {
    const j = getRandomInt(0, i);
    let t = _arr[i];
    _arr[i] = _arr[j];
    _arr[j] = t;
  }

  return _arr;
}

export const debounce = function(func, delay) {
  let timer = null;
  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay)
  } 
}