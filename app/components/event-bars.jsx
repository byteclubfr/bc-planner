import '../styles/day'

import React, { Component, PropTypes } from 'react'

import { Map } from 'immutable'

const colors = Map({
  'thomas':  '#ddc',
  'nicolas': '#cdd',
  'bruno':   '#dcd'
})

export default class EventBars extends Component {

  static propTypes = {
    clubbers: PropTypes.object.isRequired,
    events: PropTypes.arrayOf(PropTypes.object).isRequired
  }

  colorBar (color, clubberName) {
    const hasEvent = this.props.events.some(e => e.clubber === clubberName)
    const styles = hasEvent ? {
      backgroundColor: color
    } : {}

    return <div className="event-bar" style={styles} />
  }

  render () {
    return (
      <footer className="event-bars">
        {colors.map(::this.colorBar)}
      </footer>
    )
  }

}
