import '../styles/last-updates'

import React, { Component, PropTypes } from 'react'
import { Map } from 'immutable'
import moment from 'moment'

import { connect } from 'react-redux'
import { lastUpdates } from '../reducers/events'


class LastUpdates extends Component {

  static propTypes = {
    events: PropTypes.instanceOf(Map).isRequired
  }

  shouldComponentUpdate (nextProps) {
    return !this.props.events.equals(nextProps.events)
  }

  render () {
    return (
      <section id="last-updates">
        <h2>Last updates</h2>
        <ul>
          {this.props.events.toArray().map(event =>
            <li key={event.id}><a href={'#event-' + event.id}>{event.title} - @{event.location} - {moment(event.updated).fromNow()}</a></li>
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
