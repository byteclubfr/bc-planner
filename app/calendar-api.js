/*eslint no-console:0 */

import { calendarId, clientId, scopes } from './constants/google-credentials'
import store from './store'
import { fetchEvents, setOnline } from './actions'
import { shapeClientEvent, shapeServerEvent } from './utils/event'
import { defer, delay } from './utils/promise'

const GAPI_TIMEOUT = 5000

function initialFetch () {
  store.dispatch(setOnline())
  store.dispatch(fetchEvents())
}

function loadClient () {
  console.debug('gapi authorized, calendar client loading...')
  return gapi.client.load('calendar', 'v3')
    .then(::console.debug('gapi calendar client loaded'))
}

// TODO deal with rejection
function authorize () {
  console.debug('gapi authorizing...')
  return new Promise((resolve) => {
    gapi.auth.authorize({
      client_id: clientId,
      scope: scopes,
      immediate: false
    }, resolve)
  })
}

var gapiLoadDefer = defer()

// JSONP callback
window.initGapi = gapiLoadDefer.resolve

Promise.race([
  gapiLoadDefer.promise.then(authorize).then(loadClient),
  delay(GAPI_TIMEOUT).then(() => { throw new Error('gapi timeout') })
])
// TODO deal with offline mode
.then(initialFetch, () => { ::console.error('stay offline') })

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
