import { compose, createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk' // lets us dispatch() functions
import createLogger from 'redux-logger'
import persistState from 'redux-localstorage'
import { Map } from 'immutable'

import reducer from './reducers'

// Initialize persistent state to avoid error when resetting data
if (!localStorage.getItem('bc-planner')) {
  localStorage.setItem('bc-planner', '{}')
}

const createPersistentStore = compose(
  persistState(['events'], {
    // to avoid conflict with other redux projects on localhost
    key: 'bc-planner',
    deserialize: str => ({ events: Map(JSON.parse(str).events)})
  }),
)(createStore)

var middlewares = __DEV__
  // TODO: use actionTransformer to enhance display of immutable.js objects in logs
  ? applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }))
  : applyMiddleware(thunkMiddleware)

const store = middlewares(createPersistentStore)(reducer)

if (__DEV__ && module.hot) {
  // Enable Webpack hot module replacement for reducers
  module.hot.accept('./reducers', () => {
    const nextRootReducer = require('./reducers/index')
    store.replaceReducer(nextRootReducer)
  })
}

export default store
