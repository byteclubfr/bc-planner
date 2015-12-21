import './styles/index.styl'

import moment from 'moment'
import React from 'react'
import ReactDOM from 'react-dom'
import { bindActionCreators } from 'redux'
import { Provider, connect } from 'react-redux'

import store from './store'
import App from './components/app'
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

// Wrap app

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App)

ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp />
  </Provider>
, document.getElementById('root')
)
