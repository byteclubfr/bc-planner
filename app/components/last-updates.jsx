import '../styles/last-updates'

import React, { Component, PropTypes } from 'react'
import { Map } from 'immutable'

import { connect } from 'react-redux'
import { lastUpdates } from '../reducers/events'
import { formatAgo } from '../utils/date'


class LastUpdates extends Component {

  static propTypes = {
    events: PropTypes.instanceOf(Map).isRequired
  }

  shouldComponentUpdate (nextProps) {
    if (process.env.NODE_ENV === 'development') {
      if (this.props.events.equals(nextProps.events) !== (this.props.events === nextProps.events)) {
        console.warn('LastUpdate.events: EQUAL BUT NOT SAME REF')
      }
    }

    return !this.props.events.equals(nextProps.events)
  }

  render () {
    return (
      <section id="last-updates">
        <h2>Last updates</h2>
        <ul>
          {this.props.events.toArray().map(event =>
            <li key={event.id}>
              <a href={'#event-' + event.id}>{
                event.title +
                ' - @' +
                event.location +
                ' - ' +
                formatAgo(event.updated)
              }</a>
            </li>
          )}
        </ul>
      </section>
    )
  }

}


export default connect(
  ({ events }) => ({
    events: lastUpdates(events)
  })
)(LastUpdates)
