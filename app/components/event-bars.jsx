import '../styles/day'

import React, { Component, PropTypes } from 'react'

import clubbers from '../constants/clubbers'


export default class EventBars extends Component {

  static propTypes = {
    events: PropTypes.arrayOf(PropTypes.object).isRequired
  }

  colorBar (clubber, clubberName) {
    const hasEvent = this.props.events.some(e => e.clubber === clubberName)
    const styles = hasEvent ? {
      backgroundColor: clubber.color
    } : {}

    return <div className="event-bar" key={clubberName} style={styles} />
  }

  render () {
    return (
      <footer className="event-bars">
        {clubbers.map(::this.colorBar).toArray()}
      </footer>
    )
  }

}
