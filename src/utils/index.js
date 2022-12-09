export function getUpidByUrl(ctx) {
  const route = ctx.$route;
  const { query } = route;
  if (query && query['upid']) {
    return query['upid'];
  }
  return '';
}

export function randomString() {
  return Math.random().toString(32).slice(2);
}

/**
 * 
 * @param {Function} fn 
 * @param {Array} args 
 * @returns 
 */
 export function curry(fn, ...args) {
  const n = fn.length;
  args = args || [];
  return function() {
    const newArgs = args.concat(Array.prototype.slice.call(arguments));
    if (newArgs.length < n) {
      return curry.call(this, fn, ...newArgs);
    } else {
      return fn.call(this, ...newArgs);
    }
  }
}

/**
 * 防抖
 * @param {Function} fn
 * @param {Number} delay
 * @returns 
 */
export function debounce(fn, delay) {
  var timer; // 维护一个 timer
  return function () {
      var _this = this; // 取debounce执行作用域的this
      var args = arguments;
      if (timer) {
          clearTimeout(timer);
      }
      timer = setTimeout(function () {
          fn.apply(_this, args); // 用apply指向调用debounce的对象，相当于_this.fn(args);
      }, delay);
  };
}

/**
 * 节流
 * @param {Function} fn 
 * @param {Number} delay 
 * @returns 
 */
export function throttle(fn, delay) {
  var timer;
  return function () {
    var _this = this;
    var args = arguments;
    if (timer) {
        return;
    }
    timer = setTimeout(function () {
        fn.apply(_this, args);
        timer = null; // 在delay后执行完fn之后清空timer，此时timer为假，throttle触发可以进入计时器
    }, delay)
  }
}
