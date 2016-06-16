import '../styles/main-header'

import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../actions'
import { visibleEvents, filteredEvents } from '../reducers/events'


class MainHeader extends Component {

  static propTypes = {
    eventFormVisible: PropTypes.bool.isRequired,
    nbTotalEvents: PropTypes.number.isRequired,
    nbVisibleEvents: PropTypes.number.isRequired,
    nbFilteredEvents: PropTypes.number.isRequired,
    offline: PropTypes.bool.isRequired,
    searchQuery: PropTypes.string.isRequired,
    actions: PropTypes.object.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return this.props.eventFormVisible !== nextProps.eventFormVisible
        || this.props.nbTotalEvents !== nextProps.nbTotalEvents
        || this.props.nbVisibleEvents !== nextProps.nbVisibleEvents
        || this.props.nbFilteredEvents !== nextProps.nbFilteredEvents
        || this.props.offline !== nextProps.offline
        || this.props.searchQuery !== nextProps.searchQuery
  }

  changeSearch (e) {
    this.props.actions.search(e.target.value)
  }

  render () {
    const { nbTotalEvents, nbVisibleEvents, eventFormVisible, nbFilteredEvents,
      offline, searchQuery } = this.props

    var button = offline ? 'offline' : 'Add Event +'

    return (
      <header className="main-header">
        <div className="header-left">
          <h1>BC Planner</h1>
          <button
            className="event-form-open"
            disabled={eventFormVisible || offline}
            onClick={() => this.props.actions.openEventForm(null) }>{button}</button>
        </div>
        <div className="header-center">
          <h2 title="filtered / total">Events: {nbFilteredEvents} / {nbVisibleEvents} <small>(total {nbTotalEvents})</small></h2>
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
    nbTotalEvents: events.count(),
    nbVisibleEvents: visibleEvents(events, ui).count(),
    nbFilteredEvents: filteredEvents(events, ui).count(),
    offline: ui.get('offline'),
    eventFormVisible: ui.get('eventFormVisible'),
    searchQuery: ui.get('searchQuery')
  }),
  dispatch => ({ actions: bindActionCreators(actions, dispatch) })
)(MainHeader)
