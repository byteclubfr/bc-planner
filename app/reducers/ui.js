import * as actions from '../constants/actions'
import identity from 'lodash/utility/identity'


const initialState = {
  // TODO moment
  startMonth: [2015, 7],
  endMonth: [2016, 0],
  eventFormVisible: false,
  eventId: null,
  fetching: false
}


const reducers = {

  [actions.UI_OPEN_EVENT_FORM]: (state, {eventId}) => ({
    eventFormVisible: true,
    eventId: eventId
  }),

  [actions.UI_CLOSE_EVENT_FORM]: () => ({
    eventFormVisible: false
  }),

  [actions.FETCH_EVENTS]: () => ({
    fetching: true
  }),
  [actions.FETCHED_EVENTS]: () => ({
    fetching: false
  })

}


export default (state = initialState, action) => {
  var reducer = reducers[action.type] || identity
  var newState = reducer(state, action)

  return {...state, ...newState}
}



/* alternative:

export default (state = initialState, action) {
  switch (action.type) {

    case actions.UI_OPEN_EVENT_FORM:
      return {...state,
        eventFormVisible: true,
        eventId: action.eventId
      }

    case actions.UI_CLOSE_EVENT_FORM:
      return {...state,
        eventFormVisible: true,
        eventId: action.eventId
      }

    default:
      return state
  }
}

*/
