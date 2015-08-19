import Root from './containers/root'
import React from 'react'
import moment from 'moment'

moment.locale('fr')

React.render(<Root />, document.getElementById('container'))
