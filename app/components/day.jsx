import '../styles/day'

import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { Map, Set, is } from 'immutable'

import Event from './event'
import EventBars from './event-bars'
import { inclusiveIsBetween, isWeekend } from './../utils/date'

export default class Day extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    date: PropTypes.object.isRequired,
    events: PropTypes.instanceOf(Map).isRequired,
    filters: PropTypes.instanceOf(Map).isRequired,
    visibleClubbers: PropTypes.instanceOf(Set).isRequired,
    withTags: PropTypes.instanceOf(Set).isRequired
  }

  shouldComponentUpdate (nextProps) {
    return !(
      is(this.props.events, nextProps.events) &&
      this.props.filters === nextProps.filters &&
      this.props.visibleClubbers === nextProps.visibleClubbers &&
      this.props.withTags === nextProps.withTags
    )
  }

  render () {
    const { actions, date, filters, visibleClubbers, withTags } = this.props
    const events = this.props.events
      .filter(event =>
        inclusiveIsBetween(date, event.start, event.end)
      )

    return (
      <div className={classNames('day', { 'day-weekend': isWeekend(date) })}>
        <header className="day-date">{date.format('dd')[0]} {date.format('DD')}</header>
        <ul className="event-list">
          {events.map(event =>
            <Event
              actions={actions}
              event={event}
              filters={filters}
              visibleClubbers={visibleClubbers}
              withTags={withTags} />
          )}
        </ul>
        {filters.get('bars') && events.count() ? <EventBars events={events} visibleClubbers={visibleClubbers} /> : null}
      </div>
    )
  }

}
