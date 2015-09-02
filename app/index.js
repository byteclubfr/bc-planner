import './styles/index.styl'

import moment from 'moment'
import React from 'react'
import { bindActionCreators, createStore, applyMiddleware } from 'redux'
import { Provider, connect } from 'react-redux'
import thunkMiddleware from 'redux-thunk'
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

const store = applyMiddleware(
  thunkMiddleware, // lets us dispatch() functions
  createLogger({ collapsed: true }) // neat middleware that logs actions
)(createStore)(reducer)

if (module.hot) {
  // Enable Webpack hot module replacement for reducers
  module.hot.accept('./reducers', () => {
    const nextRootReducer = require('./reducers/index')
    store.replaceReducer(nextRootReducer)
  })
}

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App)

React.render(
  <Provider store={store}>
    {() => <ConnectedApp />}
  </Provider>
, document.getElementById('root')
)
