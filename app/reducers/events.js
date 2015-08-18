import * as actions from '../constants/actions'
import identity from 'lodash/utility/identity'
import {Map} from 'immutable'


const initialState = {
  events: new Map()
}


const reducers = {

  [actions.CREATED_EVENT]: (state, {event}) => ({
    events: state.events.set(event.id, event)
  }),

  [actions.UPDATED_EVENT]: (state, {event}) => ({
    events: state.events.set(event.id, event)
  }),

  [actions.DELETED_EVENT]: (state, {eventId}) => ({
    events: state.events.delete(eventId)
  }),

  [actions.FETCHED_EVENTS]: (state, {events}) => ({
    events: new Map(events.map(event => [event.id, event]))
  })

}


export default (state = initialState, action) => {
  var reducer = reducers[action.type] || identity
  var newState = reducer(state, action)

  return {...state, ...newState}
}
