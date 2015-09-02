import moment from 'moment'
import uuid from 'uuid'
import mapValues from 'lodash/object/mapValues'

import { calendarId, clientId, scopes } from '../constants/google-credentials'

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

function getExtendedProps (event) {
  if (!event.extendedProperties) {
    return { shared: {} }
  }
  // TODO
  event.extendedProperties.shared = mapValues(event.extendedProperties.shared, (v, k) => {
    if (v === 'true') return true
    if (v === 'false') return false
    if (k === 'tags') return v.split(',')
    return v
  })
  return event.extendedProperties
}

// TODO - remove
// format server event -> client event
function shapeServerEvent (event) {
  event.title = getTitle(event)
  event.start = getDate(event, 'start')
  event.end = getDate(event, 'end')
  event.clubbers = getClubber(event)
  event.extendedProperties = getExtendedProps(event)
  return event
}

// format form event -> server event
function shapeClientEvent (event) {
  event.start = { date: event.start }
  event.end = { date: moment(event.end).add(1, 'days').format('YYYY-MM-DD') }
  event.extendedProperties.shared.tags = event.extendedProperties.shared.tags.join()
  return event
}

function onAuthorized () {
  console.debug('gapi authorized')
  gapi.client.load('calendar', 'v3')
    .then(::console.debug('gapi calendar loaded'))
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
