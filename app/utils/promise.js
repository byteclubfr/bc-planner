export function delay (time) {
  return new Promise(resolve => setTimeout(resolve, time))
}

// taken from es6-defer because of node_modules excluded from babel parsing

export function defer () {
  let _resolve, _reject
  let promise = new Promise((resolve, reject) => {
    _resolve = resolve
    _reject = reject
  })

  return Object.freeze(Object.create({}, {
    resolve: {
      value: _resolve,
      enumerable: true
    },
    reject: {
      value: _reject,
      enumerable: true
    },
    promise: {
      value: promise,
      enumerable: true
    }
  }))
}
