import React, { Component, PropTypes } from 'react'
import { Map } from 'immutable'
import Month from './month'

export default class MonthList extends Component {

  static propTypes = {
    events: PropTypes.instanceOf(Map),
    month: PropTypes.arrayOf(PropTypes.number).isRequired
  }

  render () {
    const [year, month] = this.props.month
    const events = this.props.events.toArray().filter(event => {
      // TODO moment
      var dateStart = new Date(event.start)
      var dateEnd = new Date(event.end)
      return (dateStart.getFullYear() === year && dateStart.getMonth() === month) || (dateEnd.getFullYear() === year && dateEnd.getMonth() === month)
    })

    return (
      <div className="month">
        <strong>{month + 1} {year}</strong>

        <ul>
          {events.map(event => (
            <li><strong>{event.title}</strong> ({event.start} - {event.end})</li>
          ))}
        </ul>
      </div>
    )
  }

}
