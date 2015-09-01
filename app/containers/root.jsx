import { Provider, connect } from 'react-redux'
import { bindActionCreators, createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'

import React, { Component } from 'react'
import App from '../components/app'
import reducer from '../reducers'
import * as actions from '../actions'

// Connect App to Redux boilerplate

function mapStateToProps (state) {
  return {
    ui: state.ui,
    events: state.events
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App)

// Configure store

const store = applyMiddleware(
  thunkMiddleware, // lets us dispatch() functions
  createLogger({ collapsed: true }) // neat middleware that logs actions
)(createStore)(reducer)

if (module.hot) {
  // Enable Webpack hot module replacement for reducers
  module.hot.accept('../reducers', () => {
    const nextRootReducer = require('../reducers/index')
    store.replaceReducer(nextRootReducer)
  })
}

// Wrap root app

export default class Root extends Component {
  render () {
    return (
      <Provider store={store}>
        {() => <ConnectedApp />}
      </Provider>
    )
  }
}
