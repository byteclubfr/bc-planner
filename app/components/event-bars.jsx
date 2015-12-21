import '../styles/day'

import React, { Component, PropTypes } from 'react'
import { Map, Set } from 'immutable'

import clubbers from '../constants/clubbers'

export default class EventBars extends Component {

  static propTypes = {
    events: PropTypes.instanceOf(Map).isRequired,
    visibleClubbers: PropTypes.instanceOf(Set).isRequired
  }

  colorBar (clubber) {
    const hasEvent = this.props.events.some(e => Boolean(~e._clubbers.indexOf(clubber.email)))
    const styles = hasEvent ? {
      backgroundColor: clubber.color
    } : {}

    return (
      this.props.visibleClubbers.includes(clubber.email)
      ? <div className="event-bar" key={clubber.email} style={styles} />
      : null
    )
  }

  render () {
    return (
      <footer className="event-bars">
        {clubbers.toArray().map(::this.colorBar)}
      </footer>
    )
  }

}
