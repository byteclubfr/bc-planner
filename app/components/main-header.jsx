import '../styles/main-header'

import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../actions'
import { filteredEvents } from '../reducers/events'


class MainHeader extends Component {

  static propTypes = {
    eventFormVisible: PropTypes.bool.isRequired,
    nbEvents: PropTypes.number.isRequired,
    nbFilteredEvents: PropTypes.number.isRequired,
    offline: PropTypes.bool.isRequired,
    searchQuery: PropTypes.string.isRequired,
    actions: PropTypes.object.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return this.props.eventFormVisible !== nextProps.eventFormVisible
        || this.props.nbEvents !== nextProps.nbEvents
        || this.props.nbFilteredEvents !== nextProps.nbFilteredEvents
        || this.props.offline !== nextProps.offline
        || this.props.searchQuery !== nextProps.searchQuery
  }

  changeSearch (e) {
    this.props.actions.search(e.target.value)
  }

  render () {
    const { nbEvents, eventFormVisible, nbFilteredEvents, offline, searchQuery } = this.props

    var button = offline ? 'offline' : 'Add Event +'

    return (
      <header className="main-header">
        <div className="header-left">
          <h1>BC Planner</h1>
          <button
            className="event-form-open"
            disabled={eventFormVisible || offline}
            onClick={this.props.actions.openEventForm}>{button}</button>
        </div>
        <div className="header-center">
          <h2 title="filtered / total">Events: {nbFilteredEvents} / {nbEvents}</h2>
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


export default connect(
  ({ events, ui }) => ({
    nbEvents: events.count(),
    nbFilteredEvents: filteredEvents(events, ui).count(),
    offline: ui.get('offline'),
    eventFormVisible: ui.get('eventFormVisible'),
    searchQuery: ui.get('searchQuery')
  }),
  dispatch => ({ actions: bindActionCreators(actions, dispatch) })
)(MainHeader)
