import uuid from 'uuid'

const sampleEvents = [
  {
    id: uuid(),
    type: 'formation-intra',
    confirmed: true,
    start: '2015-09-10',
    end: '2015-09-12',
    clubber: 'Nicolas',
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
    clubber: 'Bruno',
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
    clubber: 'Thomas',
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
    clubber: 'Thomas',
    // TODO generate
    title: 'DEV Immobox'
  }
]

export default {

  insert: (data) => Promise.resolve({
    id: uuid(),
    ...data
  }),

  delete: (id) => Promise.resolve(),

  list: ({startMonth, endMonth, maxResults = 2500} = {}) => Promise.resolve([
    ...sampleEvents
  ]),

  patch: (id, updates) => Promise.resolve({
    id: id,
    ...updates
  })

}
