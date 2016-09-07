import './styles/index.styl'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import store from './store'
import App from './components/app'

import calendar from './calendar-api'
import firebase from './firebase-api'

calendar.init(::store.dispatch)
firebase.init(::store.dispatch)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
, document.getElementById('root')
)
