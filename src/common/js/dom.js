export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className);
}

export function addClass(el, className) {
  if (hasClass(el, className)) return;
  const newClassName = el.className.split(' ');
  newClassName.push(className);
  el.className = newClassName.join(' ');
}

export function rmClass(el, className) {
  if (!hasClass(el, className)) return;
  let reg = new RegExp(className + '(\s|$)')
  el.className = el.className.replace(reg, '')
}

export function getData(el, name, val) {
  const prefix = 'data-'; 
  if (val) {
    return el.setAttribute(prefix + name, val);
  }
  return el.getAttribute(prefix + name);
}

let elementStyle = document.createElement('div').style;
let vender = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform',
  };

  for(let key of Object.keys(transformNames)) {
    if (elementStyle[transformNames[key]] !== undefined) return key;
  }
  
  return false;
})();

export function prefixStyle(style) {
  if (vender === false) return false;
  if (vender === 'standard') return style;
  return vender + style.charAt(0).toUpperCase() + style.substr(1);
}

export function whichTransitionEvent() {
  const el = document.createElement('div');
  const transitions = {
    'transition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'MozTransition': 'transitionend',
    'WebkitTransition': 'webkitTransitionEnd',
    'MsTransition': 'msTransitionEnd',
  }
  for (let t in transitions) {
    if (el.style[t] !== undefined) {
      return transitions[t];
    }
  }

  return false;
}  