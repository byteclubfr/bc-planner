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

const ConnectedApp = connect(
  ({ events, tags, ui }) => ({ events, tags, ui }),
  (dispatch) => ({ actions: bindActionCreators(actions, dispatch) })
)(App)

ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp />
  </Provider>
, document.getElementById('root')
)
