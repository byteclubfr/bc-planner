import './styles/index.styl'

import React from 'react'
import moment from 'moment'
import Root from './containers/root'

moment.locale('fr')

React.render(<Root />, document.getElementById('container'))
