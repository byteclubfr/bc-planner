import { compose, createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk' // lets us dispatch() functions
import createLogger from 'redux-logger'
import persistState from 'redux-localstorage'
import Immutable, { Map } from 'immutable'

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

// Better logging for Immutable data structure
const stateTransformer = (state) => {
  let newState = {}
  for (var i of Object.keys(state)) {
    newState[i] = Immutable.Iterable.isIterable(state[i])
      ? state[i].toJS()
      : state[i]
  }
  return newState
}

var middlewares = __DEV__
  ? applyMiddleware(thunkMiddleware, createLogger({ collapsed: true, stateTransformer }))
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
