import '../styles/day'

import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import { inclusiveIsBetween } from './../utils/date'

export default class Day extends Component {

  static propTypes = {
    date: PropTypes.instanceOf(moment).isRequired,
    events: PropTypes.arrayOf(PropTypes.object).isRequired
  }

  render () {
    const events = this.props.events.filter(event =>
      inclusiveIsBetween(this.props.date, event.start, event.end)
    )

    return (
      <div className="day">
        <header className="day-date">{this.props.date.format('DD dd')}</header>
        <ul className="event-list">
          {events.map(event => (
            <li key={event.id}><strong>{event.title}</strong> ({event.start} - {event.end})</li>
          ))}
        </ul>
      </div>
    )
  }

}
