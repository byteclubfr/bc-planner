import React, { Component, PropTypes } from 'react'
import { Map } from 'immutable'
import Month from './month'
import moment from 'moment'

export default class MonthList extends Component {

  static propTypes = {
    events: PropTypes.instanceOf(Map),
    month: PropTypes.arrayOf(PropTypes.number).isRequired
  }

  render () {
    const date = moment(this.props.month)
    const events = this.props.events.toArray().filter(event => {
      return date.isBetween(event.start, event.end)
    })

    return (
      <div className="month">
        <strong>{date.format('MMMM YYYY')}</strong>

        <ul>
          {events.map(event => (
            <li><strong>{event.title}</strong> ({event.start} - {event.end})</li>
          ))}
        </ul>
      </div>
    )
  }

}
