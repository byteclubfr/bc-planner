import '../styles/event-form'
import '../styles/react-tags'

import React, { Component, PropTypes } from 'react'
import { WithContext as ReactTags } from 'react-tag-input'
import { Set, Map } from 'immutable'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../actions'

import clubbers from './../constants/clubbers'
import { serialize, addDay } from '../utils/date'

import Gravatar from './gravatar'

const getBlankEvent = (defaultDate) => {
  const d = defaultDate ? defaultDate : serialize(new Date())

  return Map({
    start: d,
    end: d,
    summary: '',
    location: '',
    description: '',
    attendees: [],

    _clubbers: [],
    _confirmed: false,
    _tags: []
  })
}


class EventForm extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    event: PropTypes.instanceOf(Map),
    tags: PropTypes.instanceOf(Set).isRequired
  }

  constructor (props) {
    super(props)
    this.state = { event: getBlankEvent(props.defaultDate) }
  }

  shouldComponentUpdate (nextProps, nextState) {
    if (process.env.NODE_ENV === 'development') {
      if (this.props.tags.equals(nextProps.tags) !== (this.props.tags === nextProps.tags)) {
        console.warn('EventForm.tags: EQUAL BUT NOT SAME REF') // eslint-disable-line no-console
      }
      if (this.state.event.equals(nextState.event) !== (this.state.event === nextState.event)) {
        console.warn('EventForm.event: EQUAL BUT NOT SAME REF') // eslint-disable-line no-console
      }
    }

    return this.props.tags !== nextProps.tags
        || this.state.event !== nextState.event
        || this.state.event.start !== nextProps.defaultDate
  }

  componentWillReceiveProps (props) {
    if (!props.event) {
      this.setState({ event: getBlankEvent(props.defaultDate) })
    } else {
      const tags = (props.event._tags || []).map(t => ({ id: t, text: t }))
      this.setState({ event: this.state.event.merge(props.event).set('_tags', tags) })
    }
  }

  // proxy for set stage
  setEvent (key, value) {
    this.setState({ event: this.state.event.set(key, value) })
  }

  changeStart (e) {
    this.setEvent('start', e.target.value)
  }

  changeEnd (e) {
    this.setEvent('end', e.target.value)
  }

  changeSummary (e) {
    this.setEvent('summary', e.target.value)
  }

  changeLocation (e) {
    this.setEvent('location', e.target.value)
  }

  changeDescription (e) {
    this.setEvent('description', e.target.value)
  }

  changeConfirmed (e) {
    this.setEvent('_confirmed', e.target.checked)
  }

  toggleClubber (e) {
    let attendees = this.state.event.get('attendees', []).slice()
    if (e.target.checked) {
      attendees.push({
        email: e.target.value,
        optional: false
      })
    } else {
      attendees = attendees.filter(a => a.email !== e.target.value)
    }
    this.setEvent('attendees', attendees)
  }

  // TODO
  /* eslint-disable */
  isFormValid () {
    return true
  }
  /* eslint-enable */

  submit () {
    if (!this.isFormValid()) return

    // transform tags back to a simple array with unique non null values
    var tags = this.getTags().map(t => t.text)
    const event = this.state.event.set('_tags', Array.from(new Set(tags))).toObject()

    if (event.id) {
      this.props.actions.updateEvent(event.id, event)
    } else {
      this.props.actions.createEvent(event)
    }
  }

  delete () {
    const id = this.state.event.get('id')
    if (id && window.confirm('Are you sure you want to delete this event?')) {
      this.props.actions.deleteEvent(id)
    }
  }

  getTags () {
    // TODO investigate why some null tags were created
    return this.state.event.get('_tags', []).filter(t => t)
  }

  handleAddTag (tag) {
    tag = tag.toLowerCase()
    var tags = this.getTags()
    tags.push({ id: tag, text: tag })
    this.setEvent('_tags', tags)
  }

  handleDeleteTag (i) {
    var tags = this.getTags()
    tags.splice(i, 1)
    this.setEvent('_tags', tags)
  }

  handleDragTag (tag, curPos, newPos) {
    var tags = this.getTags()
    // mutate
    tags.splice(curPos, 1)
    tags.splice(newPos, 0, tag)
    this.setEvent('_tags', tags)
  }

  clubberCheckbox (clubber, email) {
    let checked = this.state.event.get('attendees', []).some(a => a.email === email)

    return (
      <label className="event-form-clubber clubber-label" key={email} style={{backgroundColor: clubber.color}}>
        <input
          checked={checked}
          onChange={::this.toggleClubber}
          type="checkbox"
          value={email} />
        <Gravatar email={email} />
        {clubber.name}
      </label>
    )
  }

  render () {
    const event = this.state.event

    return (
      <form className="event-form fx-menu">
        <h2>
          Event Form
          <button className="event-form-close" onClick={::this.props.actions.closeEventForm} type="button">Close &times;</button>
        </h2>
        <label className="date-picker">
          From
          <input name="start" onChange={::this.changeStart} type="date" value={event.get('start')} />
        </label>
        <label className="date-picker">
          to
          <input name="end" onChange={::this.changeEnd} type="date" value={event.get('end')} />
        </label>
        <label>Summary <input name="summary" onChange={::this.changeSummary} value={event.get('summary')} /></label>
        <label>Where <input name="location" onChange={::this.changeLocation} value={event.get('location')} /></label>
        <label>Description <textarea name="description" onChange={::this.changeDescription} value={event.get('description')} /></label>
        <label>Confirmed? <input checked={event.get('_confirmed')} name="confirmed" onChange={::this.changeConfirmed} type="checkbox" /></label>

        <label>Clubbers</label>
        <div className="event-form-clubbers">
          {clubbers.map(::this.clubberCheckbox).toArray()}
        </div>

        <label>Tags</label>
        <ReactTags
          handleAddition={::this.handleAddTag}
          handleDelete={::this.handleDeleteTag}
          handleDrag={::this.handleDragTag}
          suggestions={this.props.tags.toArray()}
          shouldRenderSuggestions={q => q.length > 0}
          tags={this.getTags()} />

        <button className="event-form-save" onClick={::this.submit} type="button">Save</button>
        {(event.get('id') ? <button className="event-form-delete" onClick={::this.delete} type="button">Delete</button> : null)}
      </form>
    )
  }

}


export default connect(
  ({ ui, events, tags }) => {
    const event = events.get(ui.get('eventId'))
    return {
      event: event && Map(event), // conversion to Map, memoization could save a few renders here but it's not heavy
      defaultDate: ui.get('eventFormDefaultDate'),
      tags
    }
  },
  dispatch => ({ actions: bindActionCreators(actions, dispatch) })
)(EventForm)
