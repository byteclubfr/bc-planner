import { Map } from 'immutable'
import * as actions from '../constants/actions'

const initialContacts = Map()

export default (contacts = initialContacts, action) => {
  switch (action.type) {

  case actions.FETCHED_CONTACTS:
    return Map(action.contacts)

  default:
    return contacts
  }
}

