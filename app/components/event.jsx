import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { Map, Set } from 'immutable'
import moment from 'moment'

import Gravatar from './gravatar'

export default class Event extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    event: PropTypes.object.isRequired,
    filters: PropTypes.instanceOf(Map).isRequired,
    visibleClubbers: PropTypes.instanceOf(Set).isRequired,
    withTags: PropTypes.instanceOf(Set).isRequired
  }

  shouldComponentUpdate (nextProps) {
    return !(
      this.props.event === nextProps.event &&
      this.props.filters === nextProps.filters &&
      this.props.visibleClubbers === nextProps.visibleClubbers &&
      this.props.withTags === nextProps.withTags
    )
  }

  renderTitle (event) {
    return (
      <div className={classNames('event-title', { 'event-unconfirmed': !event._confirmed })}>
        <span title="Event confirmed?">
          {event._confirmed ? '✓' : ''}
        </span>
        <span>{event.title}</span>
      </div>
    )
  }

  renderLocation (event) {
    if (!event.location) return null

    return <div className="event-location">@{event.location}</div>
  }

  renderTag (tag) {
    let selTag = this.props.withTags.includes(tag)
    return (
      <li className={classNames('event-tag', { 'event-tag-selected': selTag })}
          key={tag}>
        {tag}
      </li>
    )
  }

  renderTags (event) {
    if (!event._tags) return null

    return <ul className="event-tags">{event._tags.sort().map(::this.renderTag)}</ul>
  }

  renderGravatars (event) {
    let clubbers = event._clubbers.filter(c => this.props.visibleClubbers.includes(c)).sort()

    return (
      <div className="event-gravatars">
        {(clubbers.map(clubber =>
          <span className="event-gravatar" key={clubber}>
            <Gravatar email={clubber} />
          </span>
        ))}
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
        <div className="event-updated">Last update: {moment(event.updated).fromNow()}</div>
      </div>
    )
  }

  render () {
    const { actions, event, filters } = this.props

    return (
      <li className="event" id={'event-' + event.id} key={event.id} onClick={() => actions.openEventForm(event.id)}>
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

}
