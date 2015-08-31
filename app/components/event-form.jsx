import '../styles/event-form'

import React, { Component, PropTypes } from 'react'

export default class EventForm extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    visible: PropTypes.bool.isRequired
  }

  render () {
    let style = {
      display: this.props.visible ? 'block' : 'none'
    }

    return (
      <form className="event-form" onSubmit={false} style={style}>
        <h2>
          Form
          <button className="event-form-close" onClick={::this.props.actions.closeEventForm} type="button">Close &times;</button>
        </h2>
        <div>
          From
          <input type="date" />
          to
          <input type="date" />
        </div>
        <div><label>Summary <input /></label></div>
        <div><label>Where <input /></label></div>
        <div><label>Description <textarea /></label></div>
        <div><button type="button">Save</button></div>
      </form>
    )
  }

}
