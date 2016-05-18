import './styles/index.styl'

import moment from 'moment'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import store from './store'
import App from './components/app'

moment.locale('fr')

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
, document.getElementById('root')
)
