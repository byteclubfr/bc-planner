import '../styles/last-updates'

import React, { Component, PropTypes } from 'react'
import { shouldComponentUpdate } from 'react-addons-pure-render-mixin'
import { Map } from 'immutable'
import moment from 'moment'

export default class LastUpdates extends Component {

  static propTypes = {
    events: PropTypes.instanceOf(Map).isRequired
  }

  constructor (props) {
    super(props)
    this.shouldComponentUpdate = shouldComponentUpdate.bind(this)
  }

  render () {
    let { events } = this.props
    events = events.sortBy(event => event.updated).reverse().take(25).toArray()

    return (
      <section id="last-updates">
        <h2>Last updates</h2>
        <ul>
          {events.map(event =>
            <li key={event.id}><a href={'#event-' + event.id}>{event.title} - @{event.location} - {moment(event.updated).fromNow()}</a></li>
          )}
        </ul>
      </section>
    )
  }

}


