import '../styles/day'

import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { Map } from 'immutable'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../actions'
import { filteredEvents, dayEvents } from '../reducers/events'

import Event from './event'
import EventBars from './event-bars'
import { isToday, isWeekend, isSameDay, formatMonthDay } from './../utils/date'


class Day extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    date: PropTypes.instanceOf(Date).isRequired,
    events: PropTypes.instanceOf(Map).isRequired,
    showBars: PropTypes.bool.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return !isSameDay(this.props.date, nextProps.date)
        || !this.props.events.equals(nextProps.events)
        || !this.props.showBars !== nextProps.showBars
  }

  render () {
    const { date, showBars, events } = this.props

    let klass = classNames('day', {
      'day-weekend': isWeekend(date),
      'day-today': isToday(date)
    })

    return (
      <div className={klass}>
        <header className="day-date">{formatMonthDay(date)}</header>
        <ul className="event-list">
          {events.toArray().map(event =>
            <Event event={event} key={event.id} />
          )}
        </ul>
        {showBars && events.count() ? <EventBars events={events} /> : null}
      </div>
    )
  }

}


export default connect(
  ({ events, ui }, { date }) => ({
    date,
    showBars: ui.getIn(['filters', 'bars'], false),
    events: dayEvents(filteredEvents(events, ui), date)
  }),
  dispatch => ({ actions: bindActionCreators(actions, dispatch) })
)(Day)
