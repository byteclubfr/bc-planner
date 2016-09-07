import { compose, createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import persistState from 'redux-localstorage'
import { Map } from 'immutable'

import reducer from './reducers'

// lets us dispatch() functions
const middlewares = [thunkMiddleware]

const enhancer = compose(
  applyMiddleware(...middlewares),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)
const enhancedCreateStore = enhancer(createStore)

// key to avoid conflict with other redux projects on localhost
const KEY = 'bc-planner'
// Initialize persistent state to avoid error when resetting data
if (!localStorage.getItem(KEY)) {
  localStorage.setItem(KEY, '{}')
}
const createPersistentStore = persistState(['events'], {
  key: KEY,
  deserialize: str => ({ events: Map(JSON.parse(str).events)})
})(enhancedCreateStore)

const store = createPersistentStore(reducer)

if (__DEV__ && module.hot) {
  // Enable Webpack hot module replacement for reducers
  module.hot.accept('./reducers', () => {
    const nextRootReducer = require('./reducers/index')
    store.replaceReducer(nextRootReducer)
  })
}

export default store
