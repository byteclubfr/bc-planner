import * as actions from '../constants/actions'
import moment from 'moment'
import { Map } from 'immutable'


const today = moment()

const initialState = Map({
  startMonth: today.toArray(),
  endMonth: today.add(6, 'month').toArray(),
  eventFormVisible: false,
  eventId: null,
  fetching: false
})

export default (state = initialState, action) => {
  switch (action.type) {

  case actions.UI_OPEN_EVENT_FORM: return state
    .set('eventFormVisible', true)
    .set('eventId', action.eventId)

  case actions.UI_CLOSE_EVENT_FORM: return state
    .set('eventFormVisible', false)

  case actions.FETCH_EVENTS: return state
    .set('fetching', true)

  case actions.FETCHED_EVENTS: return state
    .set('fetching', false)

  default: return state
  }
}
