import React, { Component, PropTypes } from 'react'
import { buildMonthsRange } from '../utils/date'
import { Map } from 'immutable'

import Filters from './filters'
import MonthList from './month-list'

export default class App extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    events: PropTypes.instanceOf(Map).isRequired,
    ui: PropTypes.instanceOf(Map).isRequired
  }

  componentDidMount () {
    this.props.actions.fetchEvents()
  }

  render () {
    const {startMonth, endMonth, fetching} = this.props.ui.toObject()

    if (fetching) {
      return <strong>Fetching…</strong>
    }

    const range = buildMonthsRange(startMonth, endMonth)

    return (
      <div>
        <Filters actions={this.props.actions} filters={this.props.ui.get('filters')} nbMonths={range.length} />
        <MonthList events={this.props.events} filters={this.props.ui.get('filters')} range={range} />
      </div>
    )
  }

}
