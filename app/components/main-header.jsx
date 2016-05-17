import '../styles/main-header'

import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Map } from 'immutable'

import { openEventForm, search } from '../actions'

class MainLoader extends Component {

  static propTypes = {
    eventFormVisible: PropTypes.bool.isRequired,
    events: PropTypes.instanceOf(Map).isRequired,
    filteredEvents: PropTypes.instanceOf(Map).isRequired,
    offline: PropTypes.bool.isRequired,
    searchQuery: PropTypes.string.isRequired,
    // actions
    openEventForm: PropTypes.func.isRequired,
    search: PropTypes.func.isRequired
  }

  changeSearch (e) {
    this.props.search(e.target.value)
  }

  render () {
    const { events, eventFormVisible, filteredEvents, offline, searchQuery,
      openEventForm } = this.props

    var button = offline ? 'offline' : 'Add Event +'

    return (
      <header className="main-header">
        <div className="header-left">
          <h1>BC Planner</h1>
          <button
            className="event-form-open"
            disabled={eventFormVisible || offline}
            onClick={openEventForm}>{button}</button>
        </div>
        <div className="header-center">
          <h2 title="filtered / total">Events: {filteredEvents.count()} / {events.count()}</h2>
        </div>
        <div className="header-right">
          <span className="connection-status">
            {offline
              ? <span className="connection-status-offline">Currently offline</span>
              : <span>Currently online</span>}
          </span>
          <input
            onChange={::this.changeSearch}
            placeholder="search"
            type="search"
            value={searchQuery} />
        </div>
      </header>
    )
  }

}

const mapStateToProps = ({ ui }) => ({
  offline: ui.get('offline')
})

const mapDispatchToProps = { openEventForm, search }

export default connect(mapStateToProps, mapDispatchToProps)(MainLoader)
