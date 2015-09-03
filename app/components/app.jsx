import '../styles/fx.styl'

import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { Map, Set } from 'immutable'

import { buildMonthsRange } from '../utils/date'

import EventForm from './event-form'
import Filters from './filters'
import MainLoader from './main-loader'
import MonthList from './month-list'

export default class App extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    events: PropTypes.instanceOf(Map).isRequired,
    tags: PropTypes.instanceOf(Set).isRequired,
    ui: PropTypes.instanceOf(Map).isRequired
  }

  componentDidMount () {
    // TODO
    setTimeout(() => this.props.actions.fetchEvents(), 2000)
  }

  closeEventForm () {
    if (!this.props.ui.toObject().eventFormVisible) return
    this.props.actions.closeEventForm()
  }

  render () {
    const { actions, events, tags, ui } = this.props
    const { startMonth, endMonth, eventFormVisible, fetching } = ui.toObject()

    const range = buildMonthsRange(startMonth, endMonth)
    const filters = ui.get('filters')
    const visibleClubbers = ui.get('visibleClubbers')
    const withTags = ui.get('withTags')
    const eventId = ui.get('eventId')

    let editableEvent = eventId ? events.get(eventId) : null

    return (
      <div className={classNames('container', 'fx-container', { 'fx-menu-open': eventFormVisible })}>
        {fetching ? <MainLoader /> : null}
        <EventForm
          actions={actions}
          event={editableEvent}
          tags={tags}
          visible={eventFormVisible} />
        <div className="fx-pusher" onClick={::this.closeEventForm}>
        <div className="fx-content"><main className="fx-content-inner">
          <h1>
            BC Planner
            <button className="event-form-open" disabled={eventFormVisible} onClick={actions.openEventForm}>Add Event +</button>
          </h1>
          <Filters
            actions={actions}
            filters={filters}
            nbMonths={range.length}
            tags={tags}
            visibleClubbers={visibleClubbers}
            withTags={withTags} />
          <MonthList
            actions={actions}
            events={events}
            filters={filters}
            range={range}
            visibleClubbers={visibleClubbers}
            withTags={withTags} />
        </main></div></div>
      </div>
    )
  }

}
