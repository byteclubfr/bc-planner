import { combineReducers } from 'redux'

import events from './events'
import tags from './tags'
import ui from './ui'

const rootReducer = combineReducers({
  events,
  tags,
  ui
})

export default rootReducer
