import { combineReducers } from 'redux'

import contacts from './contacts'
import events from './events'
import tags from './tags'
import ui from './ui'

const rootReducer = combineReducers({
  contacts,
  events,
  tags,
  ui
})

export default rootReducer
