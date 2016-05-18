import { Map } from 'immutable'
import * as actions from '../constants/actions'

import clubbers from '../constants/clubbers'
import { inclusiveIsBetween, startOfMonth, endOfMonth, isAfter, isBefore, isSameDay } from '../utils/date'


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

  let filteredEvents = events

  if (visibleClubbers.count() != clubbers.count() || withTags.count() || confirmed || lastUpdate) {
    let now = new Date()
    filteredEvents = events.filter(event => {
      let tags = event._tags || []
      let hasClubber = Boolean(visibleClubbers.intersect(event._clubbers).count())
      let hasTag = !withTags.count() || withTags.intersect(tags).count() === withTags.count()
      let c = !confirmed || (event._confirmed && confirmed === 1) || (!event._confirmed && confirmed === -1)
      let delta = !lastUpdate ? 0 : Math.abs((now - new Date(event.updated)) / 1000)
      return hasClubber && hasTag && c && (!delta || delta <= lastUpdate)
    })
  }

  if (searchQuery) {
    filteredEvents = filteredEvents.filter(event => {
      let fullText = [
        event.summary,
        event.description,
        event.location,
        (event._tags || []).join(' ')
      ].join(' ').toLowerCase()
      return fullText.includes(searchQuery)
    })
  }

  return filteredEvents
}

// TODO memoize
export const monthEvents = (events, month) => {
  const monthStart = startOfMonth(month)
  const monthEnd = endOfMonth(month)

  return events.filter(event =>
    // Event occurs in this month if it starts before end of month AND it ends after start of month
    // <=> end of month is after start of event AND start of month is before end of event
    isAfter(monthEnd, event.start) && (isBefore(monthStart, event.end) || isSameDay(monthStart, event.end))
  )
}

// TODO memoize
export const dayEvents = (events, day) =>
  events.filter(e => inclusiveIsBetween(day, e.start, e.end))
