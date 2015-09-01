import '../styles/event-form'

import React, { Component, PropTypes } from 'react'
import moment from 'moment'

export default class EventForm extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    visible: PropTypes.bool.isRequired
  }

  constructor (props) {
    super(props)
    this.state = {
      event: {
        start: moment().format('YYYY-MM-DD'),
        end: moment().add(1, 'days').format('YYYY-MM-DD'),
        extendedProperties: {
          private: {}
        }
      }
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

  setEventExtendedProps (key, value) {
    let extendedProps = {
      ...this.state.event.extendedProperties,
      private: {
        ...this.state.event.extendedProperties.private,
        [key]: value
      }
    }
    this.setEvent('extendedProperties', extendedProps)
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
    this.setEventExtendedProps('confirmed', e.target.checked)
  }

  // TODO
  isFormValid () {
    return true
  }

  submit () {
    if (!this.isFormValid()) return
    this.props.actions.createEvent(this.state.event)
  }

  render () {
    return (
      <form className="event-form fx-menu">
        <h2>
          Form
          <button className="event-form-close" onClick={::this.props.actions.closeEventForm} type="button">Close &times;</button>
        </h2>
        <label>
          From
          <input name="start" onChange={::this.changeStart} type="date" value={this.state.event.start} />
        </label>
        <label>
          to
          <input name="end" onChange={::this.changeEnd} type="date" value={this.state.event.end} />
        </label>
        <label>Summary <input name="summary" onChange={::this.changeSummary} /></label>
        <label>Where <input name="location" onChange={::this.changeLocation} /></label>
        <label>Description <textarea name="description" onChange={::this.changeDescription} /></label>
        <label>Confirmed? <input name="confirmed" onChange={::this.changeConfirmed} type="checkbox" /></label>
        <button className="event-form-save" onClick={::this.submit} type="button">Save</button>
      </form>
    )
  }

}
