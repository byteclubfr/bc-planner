import moment from 'moment'
import uuid from 'uuid'
import mapValues from 'lodash/object/mapValues'

import { calendarId, clientId, scopes } from '../constants/google-credentials'

const sampleEvents = [
  {
    id: uuid(),
    type: 'formation-intra',
    confirmed: true,
    start: '2015-09-10',
    end: '2015-09-12',
    clubber: 'naholyr@gmail.com',
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
    clubber: 'delapouite@gmail.com',
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
    clubber: 'tmoyse@gmail.com',
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
    clubber: 'tmoyse@gmail.com',
    // TODO generate
    title: 'DEV Immobox'
  }
]

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

// based on attendees
function getClubber (event) {
  var clubber = 'lilian.martineau@gmail.com'
  if (!event.attendees) return clubber

  event.attendees.forEach(function (attendee) {
    if (!attendee.optional) {
      clubber = attendee.email
    }
  })
  return clubber
}

function getExtendedProps (event) {
  if (!event.extendedProperties) {
    return { private: {} }
  }
  // TODO
  event.extendedProperties.private = mapValues(event.extendedProperties.private, (v) => {
    if (v === 'true') return true
    if (v === 'false') return false
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
  event.clubber = getClubber(event)
  event.extendedProperties = getExtendedProps(event)
  return event
}

// format form event -> server event
function shapeClientEvent (event) {
  event.start = { date: event.start }
  event.end = { date: moment(event.end).add(1, 'days').format('YYYY-MM-DD') }
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

  insertFake: (data) => Promise.resolve({
    id: uuid(),
    ...data
  }),

  insert: (data) => {
    return gapi.client.calendar.events.insert({
      calendarId,
      resource: shapeClientEvent(data)
    }).then(res => shapeServerEvent(res.result), ::console.error)
  },

  delete: (id) => Promise.resolve(),

  fakeList: ({startMonth, endMonth, maxResults = 2500} = {}) => Promise.resolve([
    ...sampleEvents
  ]),

  list: ({startMonth, endMonth, maxResults = 2500} = {}) => {
    return gapi.client.calendar.events.list({ calendarId })
      .then(res => res.result.items)
      // TODO - remove
      .then(events => events.map(shapeServerEvent))
  },

  patch: (id, updates) => Promise.resolve({
    id: id,
    ...updates
  })

}
