import '../styles/event-form'
import '../styles/react-tags'

import React, { Component, PropTypes } from 'react'
import { WithContext as ReactTags } from 'react-tag-input'
import { Set } from 'immutable'
import moment from 'moment'

import clubbers from './../constants/clubbers'
import Gravatar from './gravatar'

export default class EventForm extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    event: PropTypes.object,
    tags: PropTypes.instanceOf(Set).isRequired,
    visible: PropTypes.bool.isRequired
  }

  constructor (props) {
    super(props)
    this.state = this.getBlankEvent()
  }

  getBlankEvent () {
    return {
      event: {
        start: moment().format('YYYY-MM-DD'),
        end: moment().add(1, 'days').format('YYYY-MM-DD'),
        summary: '',
        location: '',
        description: '',
        attendees: [],

        _clubbers: [],
        _confirmed: false,
        _tags: []
      }
    }
  }

  componentWillReceiveProps (props) {
    if (!props.event) {
      this.setState(this.getBlankEvent())
    } else {
      this.setState({
        ...this.state,
        event: {
          ...props.event,
          // format needed by ReactTags
          _tags: (props.event._tags || []).map(t => ({ id: t, text: t }))
        }
      })
    }
  }

  // proxy for set stage
  setEvent (key, value) {
    let state = {
      ...this.state,
      event: {
        ...this.state.event,
        [key]: value
      }
    }
    this.setState(state)
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
    let attendees = []
    if (e.target.checked) {
      attendees = this.state.event.attendees.slice()
      attendees.push({
        email: e.target.value,
        optional: false
      })
    } else {
      attendees = this.state.event.attendees.filter(a => a.email !== e.target.value)
    }
    this.setEvent('attendees', attendees)
  }

  // TODO
  isFormValid () {
    return true
  }

  submit () {
    if (!this.isFormValid()) return

    // transform tags back to a simple array
    this.state.event._tags = this.getTags().map(t => t.text)

    if (this.state.event.id) {
      this.props.actions.updateEvent(this.state.event.id, this.state.event)
    } else {
      this.props.actions.createEvent(this.state.event)
    }
  }

  delete () {
    if (window.confirm('Are you sure you want to delete this event?') && this.state.event.id) {
      this.props.actions.deleteEvent(this.state.event.id)
    }
  }

  getTags () {
    return this.state.event._tags || []
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
    let checked = (this.state.event.attendees || []).some(a => a.email === email)

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
    return (
      <form className="event-form fx-menu">
        <h2>
          Event Form
          <button className="event-form-close" onClick={::this.props.actions.closeEventForm} type="button">Close &times;</button>
        </h2>
        <label className="date-picker">
          From
          <input name="start" onChange={::this.changeStart} type="date" value={this.state.event.start} />
        </label>
        <label className="date-picker">
          to
          <input name="end" onChange={::this.changeEnd} type="date" value={this.state.event.end} />
        </label>
        <label>Summary <input name="summary" onChange={::this.changeSummary} value={this.state.event.summary} /></label>
        <label>Where <input name="location" onChange={::this.changeLocation} value={this.state.event.location} /></label>
        <label>Description <textarea name="description" onChange={::this.changeDescription} value={this.state.event.description} /></label>
        <label>Confirmed? <input checked={this.state.event._confirmed} name="confirmed" onChange={::this.changeConfirmed} type="checkbox" /></label>

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
          tags={this.getTags()} />

        <button className="event-form-save" onClick={::this.submit} type="button">Save</button>
        {(this.state.event .id ? <button className="event-form-delete" onClick={::this.delete} type="button">Delete</button> : null)}
      </form>
    )
  }

}
