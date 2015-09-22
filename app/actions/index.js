import { actionCreator } from 'redux-action-utils'

import * as types from '../constants/actions'
import calendar from '../calendar-api'

export function openEventForm (eventId = null) {
  return {
    type: types.UI_OPEN_EVENT_FORM,
    eventId
  }
}

export const closeEventForm = actionCreator(types.UI_CLOSE_EVENT_FORM)

export function createEvent (formData) {
  return dispatch => {
    dispatch({type: types.CREATE_EVENT, formData})
    calendar.insert(formData).then(createdEvent).then(dispatch)
  }
}

export const createdEvent = actionCreator(types.CREATED_EVENT, 'event')

export function updateEvent (eventId, formData) {
  return dispatch => {
    dispatch({type: types.UPDATE_EVENT, eventId, formData})
    calendar.update(eventId, formData).then(updatedEvent).then(dispatch)
  }
}

export const updatedEvent = actionCreator(types.UPDATED_EVENT, 'event')

export function deleteEvent (eventId) {
  return dispatch => {
    dispatch({type: types.DELETE_EVENT, eventId})
    calendar.delete(eventId).then(() => dispatch(deletedEvent(eventId)))
  }
}

export const deletedEvent = actionCreator(types.DELETED_EVENT, 'eventId')

export function fetchEvents (options) {
  return dispatch => {
    dispatch({type: types.FETCH_EVENTS, options})
    calendar.list(options).then(fetchedEvents).then(dispatch)
  }
}

export const fetchedEvents = actionCreator(types.FETCHED_EVENTS, 'events')

export const toggleClubber = actionCreator(types.UI_TOGGLE_CLUBBER, 'clubber')

export const toggleFilter = actionCreator(types.UI_TOGGLE_FILTER, 'filter')

export const changeNbMonths = actionCreator(types.UI_CHANGE_NB_MONTHS, 'nbMonths')

// way = previous or next
export const changeStartMonth = actionCreator(types.UI_CHANGE_START_MONTH, 'way')

export const changeConfirmed = actionCreator(types.UI_CHANGE_CONFIRMED, 'confirmed')

export const changeLastUpdate = actionCreator(types.UI_CHANGE_LAST_UPDATE, 'lastUpdate')

export const toggleTag = actionCreator(types.UI_TOGGLE_TAG, 'tag')

export const search = actionCreator(types.UI_SEARCH, 'search')

export const setOnline = actionCreator(types.UI_SET_ONLINE)

export const setOffline = actionCreator(types.UI_SET_OFFLINE)
