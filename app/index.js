import './styles/index.styl'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import store from './store'
import App from './components/app'

import api from './calendar-api'

api.init(store.dispatch.bind(store))


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
, document.getElementById('root')
)
