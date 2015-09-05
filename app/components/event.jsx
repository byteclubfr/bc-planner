import React, { Component, PropTypes } from 'react'
import moment from 'moment'

import Gravatar from './gravatar'

export default class Event extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    event: PropTypes.object.isRequired,
    filters: PropTypes.instanceOf(Map).isRequired,
    visibleClubbers: PropTypes.instanceOf(Set).isRequired
  }

  shouldComponentUpdate (nextProps) {
    return !(
      this.props.event === nextProps.event &&
      this.props.filters === nextProps.filters &&
      this.props.visibleClubbers === nextProps.visibleClubbers
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
    const { actions, event, filters } = this.props

    return (
      <li className="event" key={event.id} onClick={() => actions.openEventForm(event.id)}>
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
