import moment from 'moment'
import { Map, Set } from 'immutable'
import { toggle } from './../utils/immutable'

import * as actions from '../constants/actions'
import clubbers from './../constants/clubbers'

const today = moment()

const initialState = Map({
  startMonth: today.toArray(),
  endMonth: moment(today).add(5, 'month').toArray(),
  eventFormVisible: false,
  eventId: null,
  fetching: true,
  offline: true,
  filters: Map({
    title: true,
    location: false,
    tags: false,
    gravatar: true,
    bars: true
  }),
  // three state range input -1 0 1
  confirmed: 0,
  // delta in seconds, 0 means all events
  lastUpdate: 0,
  search: '',
  visibleClubbers: Set(clubbers.keys()),
  withTags: Set()
})

export default (state = initialState, action) => {
  switch (action.type) {

  case actions.UI_OPEN_EVENT_FORM: return state
    .set('eventFormVisible', true)
    .set('eventId', action.eventId)

  // close form after submission
  case actions.CREATED_EVENT:
  case actions.UPDATED_EVENT:
  case actions.DELETED_EVENT:
  case actions.UI_CLOSE_EVENT_FORM: return state
    .set('eventFormVisible', false)
    .set('eventId', null)

  case actions.FETCH_EVENTS: return state
    .set('fetching', true)

  case actions.FETCHED_EVENTS: return state
    .set('fetching', false)

  case actions.UI_TOGGLE_CLUBBER: return state
    .set('visibleClubbers', toggle(state.get('visibleClubbers'), action.clubber))

  case actions.UI_TOGGLE_FILTER: return state
    .updateIn(['filters', action.filter], v => !v)

  case actions.UI_TOGGLE_TAG: return state
    .set('withTags', toggle(state.get('withTags'), action.tag))

  case actions.UI_CHANGE_NB_MONTHS:
    const startMonth = moment(state.get('startMonth'))
    const newEndMonth = startMonth.add(action.nbMonths - 1, 'month')
    return state.set('endMonth', newEndMonth.toArray())

  case actions.UI_CHANGE_START_MONTH: {
    const way = action.way === 'previous' ? -1 : 1
    const newStartMonth = moment(state.get('startMonth')).add(way, 'month')
    const newEndMonth = moment(state.get('endMonth')).add(way, 'month')
    return state.set('startMonth', newStartMonth.toArray())
                .set('endMonth', newEndMonth.toArray())
  }

  case actions.UI_CHANGE_CONFIRMED: return state
    .set('confirmed', action.confirmed)

  case actions.UI_CHANGE_LAST_UPDATE: return state
    .set('lastUpdate', action.lastUpdate)

  case actions.UI_SEARCH: return state
    .set('search', action.search)

  case actions.UI_SET_ONLINE: return state
    .set('offline', false)

  case actions.UI_SET_OFFLINE: return state
    .set('fetching', false)
    .set('offline', true)

  default: return state
  }
}
