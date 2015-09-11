import moment from 'moment'
import { mapKeys, mapValues } from 'lodash/object'

import { calendarId, clientId, scopes } from './constants/google-credentials'
import store from './store'
import { fetchEvents, setOnline } from './actions'


function getTitle (event) {
  var title = event.summary
  return title
}

// boundary: 'start' || 'end'
function getDate (event, boundary) {
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
function getClubber (event) {
  if (!event.attendees) return ['lilian.martineau@gmail.com']

  return event.attendees
    .filter(a => !a.optionnal)
    .map(a => a.email)
}

function extendedPropertiesToUnder (event) {
  if (!event.extendedProperties) return event

  let exProps = mapValues(event.extendedProperties.shared, JSON.parse)
  exProps = mapKeys(exProps, (v, k) => '_' + k)
  return {...event, ...exProps}
}

// TODO - remove
// format server event -> client event
function shapeServerEvent (event) {
  event.title = getTitle(event)
  event.start = getDate(event, 'start')
  event.end = getDate(event, 'end')

  // client only props with under
  event._clubbers = getClubber(event)
  event = extendedPropertiesToUnder(event)
  return event
}

// format form event -> server event
function shapeClientEvent (event) {
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

function initialFetch () {
  store.dispatch(setOnline())
  store.dispatch(fetchEvents())
}

function onAuthorized () {
  console.debug('gapi authorized')
  gapi.client.load('calendar', 'v3')
    .then(::console.debug('gapi calendar loaded'))
    .then(initialFetch)
}

// JSONP callback
window.initGapi = function () {
  gapi.auth.authorize({
    client_id: clientId,
    scope: scopes,
    immediate: false
  }, onAuthorized)
}

export default {

  insert: (data) => {
    return gapi.client.calendar.events.insert({
      calendarId,
      resource: shapeClientEvent(data)
    }).then(res => shapeServerEvent(res.result), ::console.error)
  },

  delete: (eventId) => {
    return gapi.client.calendar.events.delete({
      calendarId,
      eventId
    })
  },

  list: ({startMonth, endMonth, maxResults = 2500} = {}) => {
    return gapi.client.calendar.events.list({ calendarId })
      .then(res => res.result.items)
      // TODO - remove
      .then(events => events.map(shapeServerEvent))
  },

  update: (eventId, data) => {
    return gapi.client.calendar.events.update({
      calendarId,
      eventId,
      resource: shapeClientEvent(data)
    }).then(res => shapeServerEvent(res.result), ::console.error)
  }

}
