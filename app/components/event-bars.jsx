import '../styles/day'

import React, { Component, PropTypes } from 'react'
import { Map, Set } from 'immutable'

import clubbers from '../constants/clubbers'

export default class EventBars extends Component {

  static propTypes = {
    events: PropTypes.instanceOf(Map).isRequired,
    visibleClubbers: PropTypes.instanceOf(Set).isRequired
  }

  colorBar (clubber, clubberEmail) {
    const hasEvent = this.props.events.some(e => Boolean(~e._clubbers.indexOf(clubberEmail)))
    const styles = hasEvent ? {
      backgroundColor: clubber.color
    } : {}

    return (
      this.props.visibleClubbers.includes(clubberEmail)
      ? <div className="event-bar" key={clubberEmail} style={styles} />
      : null
    )
  }

  render () {
    return (
      <footer className="event-bars">
        {clubbers.map(::this.colorBar).toArray()}
      </footer>
    )
  }

}
