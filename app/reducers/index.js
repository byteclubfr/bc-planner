import { combineReducers } from 'redux'

import events from './events'
import ui from './ui'

const rootReducer = combineReducers({
  events,
  ui
})

export default rootReducer
