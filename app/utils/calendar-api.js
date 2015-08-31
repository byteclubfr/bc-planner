import moment from 'moment'
import uuid from 'uuid'

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
  if (event.location) {
    title += ` - ${event.location}`
  }
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

// TODO - remove
function transformEvents (events) {
  return events.map(function (event) {
    event.title = getTitle(event)
    event.start = getDate(event, 'start')
    event.end = getDate(event, 'end')
    event.clubber = getClubber(event)
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
