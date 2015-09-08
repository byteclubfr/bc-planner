import './styles/index.styl'

import moment from 'moment'
import React from 'react'
import { bindActionCreators, createStore, applyMiddleware } from 'redux'
import { Provider, connect } from 'react-redux'
import thunkMiddleware from 'redux-thunk' // lets us dispatch() functions
import createLogger from 'redux-logger'

import App from './components/app'
import reducer from './reducers'
import * as actions from './actions'

moment.locale('fr')

// Connect App to Redux boilerplate

function mapStateToProps (state) {
  return {
    events: state.events,
    tags: state.tags,
    ui: state.ui
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

// Configure store

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

// Wrap app

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App)

React.render(
  <Provider store={store}>
    {() => <ConnectedApp />}
  </Provider>
, document.getElementById('root')
)
