import { Map } from 'immutable'
import * as actions from '../constants/actions'

import clubbers from '../constants/clubbers'
import { inclusiveIsBetween, startOfMonth, endOfMonth, isAfter, isBefore } from '../utils/date'


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


// TODO memoize
export const lastUpdates = events =>
  events.sortBy(event => event.updated).reverse().take(25)

// TODO memoize
export const filteredEvents = (events, ui) => {
  const confirmed = ui.get('confirmed')
  const lastUpdate = ui.get('lastUpdate')
  const searchQuery = ui.get('searchQuery')
  const visibleClubbers = ui.get('visibleClubbers')
  const withTags = ui.get('withTags')
  const startMonth = ui.get('startMonth')
  const endMonth = ui.get('endMonth')

  let filteredEvents = events.filter(e =>
    isBefore(startMonth, e.end) && isAfter(endMonth, e.start))

  if (visibleClubbers.count() != clubbers.count()) {
    filteredEvents = filteredEvents.filter(e =>
      visibleClubbers.intersect(e._clubbers).count() > 0)
  }

  if (confirmed) {
    filteredEvents = filteredEvents.filter(e =>
      (e._confirmed && confirmed === 1) || (!e._confirmed && confirmed === -1))
  }

  if (lastUpdate) {
    let now = new Date()
    filteredEvents = filteredEvents.filter(e =>
      Math.abs((now - new Date(e.updated)) / 1000) <= lastUpdate)
  }

  if (withTags.count()) {
    filteredEvents = filteredEvents.filter(e =>
      withTags.intersect(e._tags || []).count() === withTags.count())
  }

  if (searchQuery) {
    filteredEvents = filteredEvents.filter(e =>
      [ e.summary, e.description, e.location, (e._tags || []).join(' ') ]
      .join(' ').toLowerCase().indexOf(searchQuery) !== -1)
  }

  return filteredEvents
}

// TODO memoize
// (Map, Date) => Map
export const monthEvents = (events, month) => {
  const monthStart = startOfMonth(month)
  const monthEnd = endOfMonth(month)

  return events.filter(event =>
    // Event occurs in this month if it starts before end of month AND it ends after start of month
    // <=> end of month is after start of event AND start of month is before end of event
    isAfter(monthEnd, event.start) && isBefore(monthStart, event.end)
  )
}

// TODO memoize
// (Map, Date) => Map
export const dayEvents = (events, day) =>
  events.filter(e => inclusiveIsBetween(day, e.start, e.end))
