import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk' // lets us dispatch() functions
import createLogger from 'redux-logger'
import reducer from './reducers'


var middlewares = __DEV__
  ? applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }))
  : applyMiddleware(thunkMiddleware)

const store = middlewares(createStore)(reducer)

if (__DEV__ && module.hot) {
  // Enable Webpack hot module replacement for reducers
  module.hot.accept('./reducers', () => {
    const nextRootReducer = require('./reducers/index')
    store.replaceReducer(nextRootReducer)
  })
}

export default store
