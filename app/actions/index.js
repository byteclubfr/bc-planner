import * as types from '../constants/actions'
import calendar from '../utils/calendar-api'

export function openEventForm (eventId = null) {
  return {
    type: types.UI_OPEN_EVENT_FORM,
    eventId
  }
}

export function closeEventForm () {
  return {
    type: types.UI_CLOSE_EVENT_FORM
  }
}

export function createEvent (formData) {
  return dispatch => {
    dispatch({type: types.CREATE_EVENT, formData})
    calendar.insert(formData).then(createdEvent).then(dispatch)
  }
}

export function createdEvent (event) {
  return {
    type: types.CREATED_EVENT,
    event
  }
}

export function updateEvent (eventId, formData) {
  return dispatch => {
    dispatch({type: types.UPDATE_EVENT, eventId, formData})
    calendar.patch(eventId, formData).then(updatedEvent).then(dispatch)
  }
}

export function updatedEvent (event) {
  return {
    type: types.UPDATED_EVENT,
    event
  }
}

export function deleteEvent (eventId) {
  return dispatch => {
    dispatch({type: types.DELETE_EVENT, eventId})
    calendar.delete(eventId).then(() => dispatch(deletedEvent(eventId)))
  }
}

export function deletedEvent (eventId) {
  return {
    type: types.DELETED_EVENT,
    eventId
  }
}

export function fetchEvents (options) {
  return dispatch => {
    dispatch({type: types.FETCH_EVENTS, options})
    calendar.list(options).then(fetchedEvents).then(dispatch)
  }
}

export function fetchedEvents (events) {
  return {
    type: types.FETCHED_EVENTS,
    events
  }
}

export function toggleFilter (filter) {
  return {
    type: types.UI_TOGGLE_FILTER,
    filter
  }
}

export function changeNbMonths (nbMonths) {
  return {
    type: types.UI_CHANGE_NB_MONTHS,
    nbMonths
  }
}
