import '../styles/day'

import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import classNames from 'classnames'

import clubbers from './../constants/clubbers'
import { inclusiveIsBetween, isWeekend } from './../utils/date'

export default class Day extends Component {

  static propTypes = {
    date: PropTypes.instanceOf(moment).isRequired,
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
                {event.clubber ? <img alt={'gravatar ' + event.clubber} src={'http://gravatar.com/avatar/' + clubbers[event.clubber] + "?s=20" } /> : ''}
              </span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

}
