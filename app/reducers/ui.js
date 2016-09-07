import { Map, Set } from 'immutable'
import { toggle } from './../utils/immutable'

import * as actions from '../constants/actions'
import clubbers from './../constants/clubbers'

import { serialize, addMonth, startOfMonth, endOfMonth } from '../utils/date'
import cacheRef from '../utils/cache-refs'


const initialState = Map({
  startMonth: serialize(startOfMonth(new Date())),
  endMonth: serialize(endOfMonth(addMonth(new Date(), 5))),
  // form
  eventFormVisible: false,
  eventFormDefaultDate: null,
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
  searchQuery: '',
  visibleClubbers: Set(clubbers.keys()),
  withTags: Set()
})

export default (state = initialState, action) => {
  switch (action.type) {

  case actions.UI_OPEN_EVENT_FORM: return state
    .set('eventFormVisible', true)
    .set('eventFormDefaultDate', action.defaultDate)
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
    .set('visibleClubbers', cacheRef('visibleClubbers', toggle(state.get('visibleClubbers'), action.clubber)))

  case actions.UI_TOGGLE_FILTER: return state
    .updateIn(['filters', action.filter], v => !v)

  case actions.UI_TOGGLE_TAG: return state
    .set('withTags', cacheRef('withTags', toggle(state.get('withTags'), action.tag)))

  case actions.UI_CHANGE_NB_MONTHS:
    return state.set('endMonth', serialize(endOfMonth(addMonth(state.get('startMonth'), action.nbMonths))))

  case actions.UI_CHANGE_START_MONTH: {
    const nb = action.way === 'previous' ? -1 : 1
    return state.set('startMonth', serialize(startOfMonth(addMonth(state.get('startMonth'), nb))))
                .set('endMonth', serialize(endOfMonth(addMonth(state.get('endMonth'), nb))))
  }

  case actions.UI_CHANGE_CONFIRMED: return state
    .set('confirmed', action.confirmed)

  case actions.UI_CHANGE_LAST_UPDATE: return state
    .set('lastUpdate', action.lastUpdate)

  case actions.UI_SEARCH: return state
    .set('searchQuery', action.searchQuery)

  case actions.UI_SET_ONLINE: return state
    .set('offline', false)

  case actions.UI_SET_OFFLINE: return state
    .set('fetching', false)
    .set('offline', true)

  default: return state
  }
}
