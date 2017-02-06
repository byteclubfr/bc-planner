import { Map } from 'immutable'
import * as actions from '../constants/actions'

import clubbers from '../constants/clubbers'
import { inclusiveIsBetween, startOfMonth, endOfMonth, isAfter, isBefore } from '../utils/date'
import { isEqual } from 'lodash/fp'
import memoize from 'memoize-immutable'
import cacheRef from '../utils/cache-refs'


const initialEvents = Map() // id:string => event:Event

export default (events = initialEvents, action) => {
  switch (action.type) {

  case actions.CREATED_EVENT:
  case actions.UPDATED_EVENT:
    if (isEqual(action.event, events.get(action.event.id))) {
      return events
    }
    return events.set(action.event.id, action.event)

  case actions.DELETED_EVENT:
    return events.delete(action.eventId)

  case actions.FETCHED_EVENTS:
    return action.events.reduce((map, e) => {
      // MUTATION WARNING: EDGE CASE
      // This has been reviewed and causes no trouble. YET.
      e._clubbers.sort()
      e._tags.sort()

      return isEqual(e, map.get(e.id)) ? map : map.set(e.id, e)
    }, events)

  default:
    return events
  }
}


export const lastUpdates = memoize(events =>
  events.sortBy(event => event.updated).reverse().take(25))

const _filteredEvents = memoize((
  events,
  confirmed,
  invoiced,
  lastUpdate,
  searchQuery,
  visibleClubbers,
  withTags
) => {
  let filteredEvents = events

  if (visibleClubbers.count() != clubbers.count()) {
    filteredEvents = filteredEvents.filter(e =>
      visibleClubbers.intersect(e._clubbers).count() > 0)
  }

  if (confirmed) {
    filteredEvents = filteredEvents.filter(e =>
      (e._confirmed && confirmed === 1) || (!e._confirmed && confirmed === -1))
  }

  if (invoiced) {
    filteredEvents = filteredEvents.filter(e =>
      (e._invoiced && invoiced === 1) || (!e._invoiced && invoiced === -1))
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
})

export function filteredEvents (events, ui) {
  return _filteredEvents(
    visibleEvents(events, ui),
    ui.get('confirmed'),
    ui.get('invoiced'),
    ui.get('lastUpdate'),
    ui.get('searchQuery'),
    ui.get('visibleClubbers'),
    ui.get('withTags')
  )
}

const _visibleEvents = memoize((
  events,
  startMonth,
  endMonth
) =>
  events.filter(e => isBefore(startMonth, e.end) && isAfter(endMonth, e.start))
)

export function visibleEvents (events, ui) {
  return _visibleEvents(
    events,
    ui.get('startMonth'),
    ui.get('endMonth')
  )
}

// (Map, string) => Map
export const monthEvents = memoize((events, month) => {
  const monthStart = startOfMonth(month)
  const monthEnd = endOfMonth(month)

  return cacheRef('monthEvents', events.filter(event =>
    // Event occurs in this month if it starts before end of month AND it ends after start of month
    // <=> end of month is after start of event AND start of month is before end of event
    isAfter(monthEnd, event.start) && isBefore(monthStart, event.end)
  ))
})

// (Map, string) => Map
export const dayEvents = memoize((events, day) => {
  return cacheRef('dayEvents', events.filter(e =>
    inclusiveIsBetween(day, e.start, e.end)
  ))
})
