import React, { Component, PropTypes } from 'react'
import { Map } from 'immutable'
import { buildMonthsRange } from '../utils/date'

import EventForm from './event-form'
import Filters from './filters'
import MonthList from './month-list'

export default class App extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    events: PropTypes.instanceOf(Map).isRequired,
    ui: PropTypes.instanceOf(Map).isRequired
  }

  componentDidMount () {
    // TODO
    setTimeout(() => this.props.actions.fetchEvents(), 2000)
  }

  render () {
    const { actions, events, ui } = this.props
    const { startMonth, endMonth, eventFormVisible, fetching } = ui.toObject()

    if (fetching) {
      return <strong>Fetching…</strong>
    }

    const range = buildMonthsRange(startMonth, endMonth)
    const filters = ui.get('filters')
    const visibleClubbers = ui.get('visibleClubbers')

    return (
      <main>
        <h1>
          BC Planner
          <button className="event-form-open" disabled={eventFormVisible} onClick={actions.openEventForm}>Add Event</button>
        </h1>
        <EventForm actions={actions} visible={eventFormVisible} />
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
