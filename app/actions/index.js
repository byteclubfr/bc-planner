import * as types from '../constants/actions'
import calendar from '../calendar-api'

// eventId is used to edit, defaultDate is used for new events after clicking on a day
export const openEventForm = (eventId = null, defaultDate) => ({ type: types.UI_OPEN_EVENT_FORM, eventId, defaultDate })

export const closeEventForm = () => ({ type: types.UI_CLOSE_EVENT_FORM })

export function createEvent (formData) {
  return dispatch => {
    dispatch({type: types.CREATE_EVENT, formData})
    calendar.insert(formData).then(createdEvent).then(dispatch)
  }
}

export const createdEvent = (event) => ({ type: types.CREATED_EVENT, event })

export function updateEvent (eventId, formData) {
  return dispatch => {
    dispatch({type: types.UPDATE_EVENT, eventId, formData})
    calendar.update(eventId, formData).then(updatedEvent).then(dispatch)
  }
}

export const updatedEvent = (event) => ({ type: types.UPDATED_EVENT, event })

export function deleteEvent (eventId) {
  return dispatch => {
    dispatch({type: types.DELETE_EVENT, eventId})
    calendar.delete(eventId).then(() => dispatch(deletedEvent(eventId)))
  }
}

export const deletedEvent = (eventId) => ({ type: types.DELETED_EVENT, eventId })

export function fetchEvents (options) {
  return dispatch => {
    dispatch({type: types.FETCH_EVENTS, options})
    calendar.list(options).then(fetchedEvents).then(dispatch)
  }
}

export const fetchedEvents = (events) => ({ type: types.FETCHED_EVENTS, events })

export const toggleClubber = (clubber) => ({ type: types.UI_TOGGLE_CLUBBER, clubber })

export const toggleFilter = (filter) => ({ type: types.UI_TOGGLE_FILTER, filter })

export const changeNbMonths = (nbMonths) => ({ type: types.UI_CHANGE_NB_MONTHS, nbMonths })

// way = previous or next
export const changeStartMonth = (way) => ({ type: types.UI_CHANGE_START_MONTH, way })

export const changeConfirmed = (confirmed) => ({ type: types.UI_CHANGE_CONFIRMED, confirmed })

export const changeLastUpdate = (lastUpdate) => ({ type: types.UI_CHANGE_LAST_UPDATE, lastUpdate })

export const toggleTag = (tag) => ({ type: types.UI_TOGGLE_TAG, tag })

export const search = (searchQuery) => ({ type: types.UI_SEARCH, searchQuery })

export const setOnline = () => ({ type: types.UI_SET_ONLINE })

export const setOffline = () => ({ type: types.UI_SET_OFFLINE })

export const fetchedContacts = (contacts) => ({ type: types.FETCHED_CONTACTS, contacts })
