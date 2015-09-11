import { calendarId, clientId, scopes } from './constants/google-credentials'
import store from './store'
import { fetchEvents, setOnline } from './actions'
import { shapeClientEvent, shapeServerEvent } from './utils/event'


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
