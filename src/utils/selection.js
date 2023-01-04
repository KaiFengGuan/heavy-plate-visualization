/**
 * 
 * @param {selection} selection 
 * @param {String} tag 
 * @param {object} attrs 
 * @returns selection
 */
export function appendElement(selection, tag, attrs) {
  let element = selection.append(tag);
  return updateElement(element, attrs);
}

/**
 * 
 * @param {selection} selection 
 * @param {object} attrs 
 * @returns selection
 */
export function updateElement(selection, attrs) {
  for (let item in attrs) {
    if (item == 'text') {
      selection.text(attrs[item])
    } else if (item == 'datum') {
      selection.datum(attrs[item])
    } else {
      selection.attr(item, attrs[item])
    }
  }
  return selection;
}

/**
 * 
 * @param {selection} element 
 * @param {object} styles 
 * @returns selection
 */
export function updateStyles(selection, styles) {
  for (let item in styles) {
    selection.style(item, styles[item])
  }
  return selection;
}

/**
 * 
 * @param {selection} selection 
 * @param {object} attrs 
 * @returns 
 */
export function updateDatum(selection, attrs) {
  delete attrs['datum'];
  delete attrs['data'];
  return updateElement(selection, attrs);
}

/**
 * 
 * @param {selection} selection 
 * @param {object} attrs 
 * @returns 
 */
export function updateAsyncElement(selection, attrs) {
  for (let item in attrs) {
    if (attrs[item] instanceof Function) {
      if (item == 'text') {
        selection.text(attrs[item])
      } else {
        selection.attr(item, attrs[item])
      }
    }
  }
  return selection;
}

/**
 * 
 * @param {*} selection 
 * @param {*} attr 
 * @param {*} fn 
 * @param {*} endfunc 
 * @returns 
 */
export function attrTween(selection, attr, fn, endfunc) {
  selection
    .attrTween(attr, fn)
    .on('end', endfunc)
  return selection;
}

/**
 * 
 * @param {*} x 
 * @param {*} y 
 * @returns 
 */
export function translate(x, y) {
  return `translate(${[x, y]})`;
}