import * as actions from '../constants/actions'
import {Map} from 'immutable'


const initialEvents = Map() // id:string => event:Event

export default (events = initialEvents, action) => {
  switch (action.type) {

  case actions.CREATED_EVENT:
  case actions.UPDATED_EVENT:
    return events.set(action.event.id, action.event)

  case actions.DELETED_EVENT:
    return events.delete(action.eventId)

  case actions.FETCHED_EVENTS:
    return Map(action.events.map(e => [e.id, e]))

  default:
    return events
  }
}
