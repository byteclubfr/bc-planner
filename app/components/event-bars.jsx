import '../styles/day'

import React, { Component, PropTypes } from 'react'
import { Set } from 'immutable'

import clubbers from '../constants/clubbers'

export default class EventBars extends Component {

  static propTypes = {
    events: PropTypes.arrayOf(PropTypes.object).isRequired,
    visibleClubbers: PropTypes.instanceOf(Set).isRequired
  }

  colorBar (clubber, clubberName) {
    const hasEvent = this.props.events.some(e => e.clubber === clubberName)
    const styles = hasEvent ? {
      backgroundColor: clubber.color
    } : {}

    return (
      this.props.visibleClubbers.includes(clubberName)
      ? <div className="event-bar" key={clubberName} style={styles} />
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
