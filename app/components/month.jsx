import React, { Component, PropTypes } from 'react'
import { Map } from 'immutable'
import Month from './month'
import moment from 'moment'

export default class MonthList extends Component {

  static propTypes = {
    date: PropTypes.any.isRequired,
    events: PropTypes.instanceOf(Map)
  }

  render () {
    const date = moment(this.props.date)
    const dateStart = moment(date).startOf('month')
    const dateEnd = moment(date).endOf('month')
    const events = this.props.events.toArray().filter(event =>
      // Event occurs in this month if it starts before end of month AND it ends after start of month
      // <=> end of month is after start of event AND start of month is before end of event
      dateEnd.isAfter(event.start) && dateStart.isBefore(event.end)
    )

    return (
      <div className="month">
        <strong>{date.format('MMMM YYYY')}</strong>

        <ul>
          {events.map(event => (
            <li key={event.id}><strong>{event.title}</strong> ({event.start} - {event.end})</li>
          ))}
        </ul>
      </div>
    )
  }

}
