import moment from 'moment'
import { mapKeys, mapValues, pipe } from 'lodash/fp'

// the following fns are used as translators between events shaped by Google
// and the ones we need client side


// TODO better title construction
export function getTitle (event) {
  var title = event.summary
  return title
}

// boundary: 'start' || 'end'
export function getDate (event, boundary) {
  var d
  var date = event[boundary]
  // all day event
  if (date.date) {
    // start is inclusive, end is exclusive
    d = date.date
    if (boundary === 'end') {
      d = moment(d).subtract(1, 'days')
    }
  } else {
    d = date.dateTime
  }
  return moment(d).format('YYYY-MM-DD')
}

// based on attendees for now
export function getClubber (event) {
  if (!event.attendees) return ['byteclubfr@gmail.com']

  return event.attendees
    .filter(a => !a.optionnal)
    .map(a => a.email)
}

const getExProps = pipe(mapValues(JSON.parse), mapKeys(k => '_' + k))

export function extendedPropertiesToUnder (event) {
  if (!event.extendedProperties) return event

  return {...event, ...getExProps(event.extendedProperties.shared)}
}


// TODO - remove
// format server event -> client event
export function shapeServerEvent (event) {
  event.title = getTitle(event)
  event.start = getDate(event, 'start')
  event.end = getDate(event, 'end')

  // client only props with under
  event._clubbers = getClubber(event)
  event = extendedPropertiesToUnder(event)
  return event
}

// format form event -> server event
export function shapeClientEvent (event) {
  event = { ...event }
  event.start = { date: event.start }
  event.end = { date: moment(event.end).add(1, 'days').format('YYYY-MM-DD') }
  if (!event.extendedProperties) event.extendedProperties = {}

  // move back under props in shared
  event.extendedProperties.shared = {
    ...event.extendedProperties.shared,
    confirmed: event._confirmed,
    tags: JSON.stringify(event._tags)
  }

  // TODO
  delete event._clubbers
  delete event._confirmed
  delete event._tags

  return event
}
