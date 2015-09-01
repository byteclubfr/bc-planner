import '../styles/event-form'

import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'

export default class EventForm extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    visible: PropTypes.bool.isRequired
  }

  render () {
    return (
      <form className="event-form fx-menu" onSubmit={false}>
        <h2>
          Form
          <button className="event-form-close" onClick={::this.props.actions.closeEventForm} type="button">Close &times;</button>
        </h2>
          <label>
            From
            <input type="date" />
          </label>
          <label>
            to
            <input type="date" />
          </label>
        <label>Summary <input /></label>
        <label>Where <input /></label>
        <label>Description <textarea /></label>
        <button className="event-form-save" type="button">Save</button>
      </form>
    )
  }

}
