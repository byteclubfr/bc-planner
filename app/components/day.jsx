import '../styles/day'

import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { Map, Set } from 'immutable'

import Gravatar from './gravatar'
import EventBars from './event-bars'
import { inclusiveIsBetween, isWeekend } from './../utils/date'

export default class Day extends Component {

  static propTypes = {
    date: PropTypes.object.isRequired,
    events: PropTypes.arrayOf(PropTypes.object).isRequired,
    filters: PropTypes.instanceOf(Map).isRequired,
    visibleClubbers: PropTypes.instanceOf(Set).isRequired
  }

  renderTitle (event) {
    return <span className="event-title">{event.title}</span>
  }

  renderGravatar (event) {
    return (
      <span className="event-gravatar">
        <Gravatar clubberEmail={event.clubber} />
      </span>
    )
  }

  render () {
    const { date, filters, visibleClubbers } = this.props
    const events = this.props.events.filter(event =>
      inclusiveIsBetween(date, event.start, event.end)
    )
    .map(event => { event.visible = visibleClubbers.includes(event.clubber); return event })

    return (
      <div className={classNames('day', { 'day-weekend': isWeekend(date) })}>
        <header className="day-date">{date.format('dd DD')}</header>
        <ul className="event-list">
          {events.map(event => (
            <li className={classNames('event', { 'event-faded': !event.visible })} key={event.id}>
              {filters.get('title') ? this.renderTitle(event) : null}
              {filters.get('gravatar') ? this.renderGravatar(event) : null}
            </li>
          ))}
        </ul>
        {filters.get('bars') ? <EventBars events={events} visibleClubbers={visibleClubbers} /> : null}
      </div>
    )
  }

}
