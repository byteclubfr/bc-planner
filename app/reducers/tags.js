import { Set } from 'immutable'
import * as actions from '../constants/actions'

const initialTags = Set()

export default (tags = initialTags, action) => {
  switch (action.type) {

  // TODO better handling of orphan tags
  case actions.CREATED_EVENT:
  case actions.UPDATED_EVENT:
    return tags.union(action.event._tags)

  case actions.DELETED_EVENT:
    return tags

  case actions.FETCHED_EVENTS:
    tags = action.events.reduce((acc, event) => {
      return acc.concat(event._tags || [])
    }, [])
    // avoid null tag
    .filter(t => t)
    return Set(tags)

  default:
    return tags
  }
}

