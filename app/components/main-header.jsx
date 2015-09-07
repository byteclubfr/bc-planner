import React, { Component, PropTypes } from 'react'
import { Map } from 'immutable'

export default class MainLoader extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    eventFormVisible: PropTypes.bool.isRequired,
    events: PropTypes.instanceOf(Map).isRequired,
    filteredEvents: PropTypes.instanceOf(Map).isRequired,
    search: PropTypes.string.isRequired
  }

  changeSearch (e) {
    this.props.actions.search(e.target.value)
  }

  render () {
    const { actions, events, eventFormVisible, filteredEvents, search } = this.props

    return (
      <header className="main-header">
        <div className="header-left">
          <h1>BC Planner</h1>
          <button
            className="event-form-open"
            disabled={eventFormVisible}
            onClick={actions.openEventForm}>Add Event +</button>
        </div>
        <div className="header-center">
          <h2 title="filtered / total">Events: {filteredEvents.count()} / {events.count()}</h2>
        </div>
        <div className="header-right">
          <input
            onChange={::this.changeSearch}
            placeholder="search"
            type="search"
            value={search} />
        </div>
      </header>
    )
  }

}
