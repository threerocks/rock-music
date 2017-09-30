export function hasClass(el, className) {
  let reg = new RegExp('(^|\s)' + className + '(\s|$)')

  return reg.text(el.className);
}

export function addClass(el, className) {
  if (hasClass(className)) return;
  el.className = el.className.split(' ').push(className).join(' ');
}