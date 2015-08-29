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
    const { actions, events, ui } = this.props
    const { startMonth, endMonth, fetching } = ui.toObject()

    if (fetching) {
      return <strong>Fetching…</strong>
    }

    const range = buildMonthsRange(startMonth, endMonth)
    const filters = ui.get('filters')
    const visibleClubbers = ui.get('visibleClubbers')

    return (
      <main>
        <Filters
          actions={actions}
          filters={filters}
          nbMonths={range.length}
          visibleClubbers={visibleClubbers} />
        <MonthList
          events={events}
          filters={filters}
          range={range}
          visibleClubbers={visibleClubbers} />
      </main>
    )
  }

}
