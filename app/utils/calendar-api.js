import uuid from 'uuid'

import { calendarId, clientId, scopes } from '../constants/google-credentials'

const sampleEvents = [
  {
    id: uuid(),
    type: 'formation-intra',
    confirmed: true,
    start: '2015-09-10',
    end: '2015-09-12',
    clubber: 'nicolas',
    subject: 'Node',
    place: 'Paris',
    // TODO generate
    title: 'INTRA Node Paris'
  },
  {
    id: uuid(),
    type: 'formation-inter',
    confirmed: true,
    start: '2015-09-15',
    end: '2015-09-17',
    clubber: 'bruno',
    subject: 'Angular',
    place: 'Paris',
    // TODO generate
    title: 'INTER Angular Paris'
  },
  {
    id: uuid(),
    type: 'bootcamp',
    confirmed: true,
    start: '2015-09-14',
    end: '2015-09-18',
    clubber: 'thomas',
    subject: 'Angular',
    place: 'Paris',
    // TODO generate
    title: 'Bootcamp Angular Paris'
  },
  {
    id: uuid(),
    type: 'formation-inter',
    confirmed: false,
    start: '2015-10-21',
    end: '2015-10-22',
    subject: 'React',
    place: 'Toulouse',
    clubber: null,
    // TODO generate
    title: 'INTER React Toulouse'
  },
  {
    id: uuid(),
    type: 'dev',
    confirmed: false,
    start: '2015-10-30',
    end: '2015-11-10',
    subject: 'Immobox',
    place: null,
    clubber: 'thomas',
    // TODO generate
    title: 'DEV Immobox'
  }
]

// boundary: event.start || event.end
function getDate (boundary) {
  return boundary.date || boundary.dateTime.slice(0, 10)
}

// TODO - remove
function transformEvents (events) {
  return events.map(function (event) {
    event.title = event.summary
    event.start = getDate(event.start)
    event.end = getDate(event.end)
    event.clubber = 'lilian'
    return event
  })
}

function onAuthorized () {
  console.debug('gapi authorized')
  gapi.client.load('calendar', 'v3')
    .then(::console.debug('gapi calendar loaded'))
}

window.initGapi = function () {
  gapi.auth.authorize({
    client_id: clientId,
    scope: scopes,
    immediate: false
  }, onAuthorized)
}

export default {

  insert: (data) => Promise.resolve({
    id: uuid(),
    ...data
  }),

  delete: (id) => Promise.resolve(),

  fakeList: ({startMonth, endMonth, maxResults = 2500} = {}) => Promise.resolve([
    ...sampleEvents
  ]),

  list: ({startMonth, endMonth, maxResults = 2500} = {}) => {
    return gapi.client.calendar.events.list({ calendarId })
      .then(res => res.result.items)
      // TODO - remove
      .then(transformEvents)
  },

  patch: (id, updates) => Promise.resolve({
    id: id,
    ...updates
  })

}
