import React, { Component, PropTypes } from 'react'
import MonthList from './month-list'
import { buildMonthsRange } from '../utils/date'

export default class App extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    events: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired
  }

  componentDidMount () {
    this.props.actions.fetchEvents()
  }

  render () {
    const {startMonth, endMonth, fetching} = this.props.ui

    if (fetching) {
      return <strong>Fetching…</strong>
    }

    const range = buildMonthsRange(startMonth, endMonth)

    return <MonthList events={this.props.events.events} range={range} />
  }

}
