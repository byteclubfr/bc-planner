import '../styles/day'

import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import classNames from 'classnames'

import Gravatar from './gravatar'
import { inclusiveIsBetween, isWeekend } from './../utils/date'

import EventBars from './event-bars'

export default class Day extends Component {

  static propTypes = {
    date: PropTypes.object.isRequired,
    events: PropTypes.arrayOf(PropTypes.object).isRequired
  }

  render () {
    const { date } = this.props
    const events = this.props.events.filter(event =>
      inclusiveIsBetween(date, event.start, event.end)
    )

    return (
      <div className={classNames('day', { 'day-weekend': isWeekend(date) })}>
        <header className="day-date">{date.format('dd DD')}</header>
        <ul className="event-list">
          {events.map(event => (
            <li key={event.id}>
              <span className="event-title">{event.title}</span>
              <span className="event-gravatar">
                <Gravatar clubberName={event.clubber} />
              </span>
            </li>
          ))}
        </ul>
        <EventBars clubbers={clubbers} events={events} />
      </div>
    )
  }

}
