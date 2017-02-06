import { OrderedMap } from 'immutable'
import * as actions from '../constants/actions'

const initialContacts = OrderedMap()

export default (contacts = initialContacts, action) => {
  switch (action.type) {

  case actions.FETCHED_CONTACTS:
    return OrderedMap(action.contacts)

  default:
    return contacts
  }
}

