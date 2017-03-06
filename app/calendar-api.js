/*eslint no-console:0 */

import { calendarId, clientId, scopes } from './constants/google-credentials'
import { fetchEvents, setOnline, setOffline } from './actions'
import { shapeClientEvent, shapeServerEvent } from './utils/event'
import { defer, delay } from './utils/promise'

// after this delay, give up
const GAPI_TIMEOUT = 30000

function initialFetch (dispatch) {
  dispatch(setOnline())
  dispatch(fetchEvents())
}

function loadClient (token) {
  console.debug('gapi authorized, calendar client loading...', token)
  return gapi.client.load('calendar', 'v3')
    .then(::console.debug('gapi calendar client loaded'))
}

// TODO deal with rejection
function authorize (immediate) {
  console.debug('gapi authorizing...')
  return new Promise((resolve) => {
    gapi.auth.authorize({
      client_id: clientId,
      scope: scopes,
      immediate: Boolean(immediate)
    }, resolve)
  })
}

if (typeof window !== 'undefined') {
  // Browser environment
  var gapiLoadDefer = defer()
  // JSONP callback
  window.initGapi = gapiLoadDefer.resolve

  setInterval(() => {
    authorize(true)
  }, 45 * 60 * 1000)
}

export default {

  init: (dispatch) => {
    return Promise.race([
      gapiLoadDefer.promise.then(authorize).then(loadClient),
      delay(GAPI_TIMEOUT).then(() => { throw new Error('gapi timeout') })
    ])
    .then(() => initialFetch(dispatch))
    .catch(() => dispatch(setOffline()))
  },

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

  list: ({startMonth, endMonth, maxResults = 2500} = {}) => { // eslint-disable-line
    return gapi.client.calendar.events.list({ calendarId, maxResults })
      .then(res => res.result.items)
      .then(events => { console.debug(events.length, 'events loaded'); return events })
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
