import { Set } from 'immutable'
import get from 'lodash/object/get'
import * as actions from '../constants/actions'

const initialTags = Set()

export default (tags = initialTags, action) => {
  switch (action.type) {

  // TODO better handling of orphan tags
  case actions.CREATED_EVENT:
  case actions.UPDATED_EVENT:
    return tags.union(action.event.extendedProperties.shared.tags)

  case actions.DELETED_EVENT:
    return tags

  case actions.FETCHED_EVENTS:
    tags = action.events.reduce((acc, event) => {
      return acc.concat(get(event, 'extendedProperties.shared.tags', []))
    }, []).sort()
    return Set(tags)

  default:
    return tags
  }
}

