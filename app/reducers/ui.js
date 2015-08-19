import * as actions from '../constants/actions'
import moment from 'moment'
import { Map } from 'immutable'


const today = moment()

const initialState = Map({
  startMonth: today.toArray(),
  endMonth: moment(today).add(5, 'month').toArray(),
  eventFormVisible: false,
  eventId: null,
  fetching: false,
  filters: Map({
    title: true,
    gravatar: true,
    bars: true
  })
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

  case actions.UI_TOGGLE_FILTER:
    const filters = state.get('filters')
    const newFilters = filters.set(action.filter, !filters.get(action.filter, false))
    return state.set('filters', newFilters)

  case actions.UI_CHANGE_NB_MONTHS:
    const startMonth = moment(state.get('startMonth'))
    const newEndMonth = startMonth.add(action.nbMonths - 1, 'month')
    return state.set('endMonth', newEndMonth.toArray())

  default: return state
  }
}
