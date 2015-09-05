import '../styles/day'

import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { Map, Set } from 'immutable'
import moment from 'moment'

import Gravatar from './gravatar'
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

  renderEvent (event) {
    const { filters } = this.props
    return (
      <li className="event" key={event.id} onClick={() => this.props.actions.openEventForm(event.id)}>
        {this.renderPopOver(event)}
        <div className="event-snippet">
          {filters.get('title') ? this.renderTitle(event) : null}
          {filters.get('location') ? this.renderLocation(event) : null}
          {filters.get('tags') ? this.renderTags(event) : null}
        </div>
        {filters.get('gravatar') ? this.renderGravatars(event) : null}
      </li>
    )
  }

  renderTitle (event) {
    return (
      <div className="event-title">
        <span className="event-confirmed" title="Event confirmed?">
          {event._confirmed ? '✓' : '✗'}
        </span>
        <span>{event.title}</span>
      </div>
    )
  }

  renderLocation (event) {
    return <div className="event-location">{event.location}</div>
  }

  renderTags (event) {
    if (!event._tags) return null

    return <div className="event-tags">{event._tags.sort().join(', ')}</div>
  }

  renderGravatars (event) {
    let clubbers = event._clubbers.filter(c => this.props.visibleClubbers.includes(c))

    return (
      <div className="event-gravatars">
        {(clubbers.map(clubber => {
          return (
            <span className="event-gravatar" key={clubber}>
              <Gravatar email={clubber} />
            </span>
          )
        }))}
      </div>
    )
  }

  renderDates (event) {
    let f = 'ddd D MMM'

    return (
      <div className="event-dates">
        {moment(event.start).format(f)}
        {event.start !== event.end ? ' - ' + moment(event.end).format(f) : null}
      </div>
    )
  }

  renderPopOver (event) {
    return (
      <div className="event-pop-over">
        {this.renderTitle(event)}
        {this.renderDates(event)}
        {this.renderGravatars(event)}
        {this.renderLocation(event)}
        {this.renderTags(event)}
        <div className="event-description">{event.description}</div>
      </div>
    )
  }

  render () {
    const { date, filters, withTags, visibleClubbers } = this.props
    const events = this.props.events
      .filter(event =>
        inclusiveIsBetween(date, event.start, event.end)
      )
      .filter(event => {
        let tags = event._tags || []
        let hasClubber = Boolean(visibleClubbers.intersect(event._clubbers).count())
        let hasTag = !Boolean(withTags.count()) || withTags.intersect(tags).count() === withTags.count()
        return hasClubber && hasTag
      })

    return (
      <div className={classNames('day', { 'day-weekend': isWeekend(date) })}>
        <header className="day-date">{date.format('dd')[0]} {date.format('DD')}</header>
        <ul className="event-list">
          {events.map(::this.renderEvent)}
        </ul>
        {filters.get('bars') ? <EventBars events={events} visibleClubbers={visibleClubbers} /> : null}
      </div>
    )
  }

}
