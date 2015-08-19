import '../styles/month'

import React, { Component, PropTypes } from 'react'
import { Map } from 'immutable'
import moment from 'moment'
import range from 'lodash/utility/range'

import Day from './day'

export default class Month extends Component {

  static propTypes = {
    events: PropTypes.instanceOf(Map),
    month: PropTypes.arrayOf(PropTypes.number).isRequired
  }

  render () {
    const date = moment(this.props.month)
    const daysInMonth = range(1, date.daysInMonth())
    const events = this.props.events.toArray().filter(event => {
      return date.isBetween(event.start, event.end)
    })

    return (
      <div className="month">
        <header className="month-title">{date.format('MMMM YYYY')}</header>

        <ul>
          {events.map(event => (
            <li><strong>{event.title}</strong> ({event.start} - {event.end})</li>
          ))}
        </ul>

        {daysInMonth.map(day => (
          <Day day={day} />
        ))}
      </div>
    )
  }

}
