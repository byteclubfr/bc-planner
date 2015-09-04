import '../styles/fx.styl'

import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { Map, Set } from 'immutable'

import { buildMonthsRange } from '../utils/date'

import EventForm from './event-form'
import Filters from './filters'
import MainLoader from './main-loader'
import MonthList from './month-list'

import { onReady } from '../utils/calendar-api'


export default class App extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    events: PropTypes.instanceOf(Map).isRequired,
    tags: PropTypes.instanceOf(Set).isRequired,
    ui: PropTypes.instanceOf(Map).isRequired
  }

  componentDidMount () {
    onReady().then(() => this.props.actions.fetchEvents())
  }

  closeEventForm () {
    if (!this.props.ui.toObject().eventFormVisible) return
    this.props.actions.closeEventForm()
  }

  changeSearch (e) {
    this.props.actions.search(e.target.value)
  }

  render () {
    const { actions, tags, ui } = this.props
    const { startMonth, endMonth, eventFormVisible, fetching } = ui.toObject()

    const range = buildMonthsRange(startMonth, endMonth)
    const filters = ui.get('filters')
    const visibleClubbers = ui.get('visibleClubbers')
    const withTags = ui.get('withTags')
    const eventId = ui.get('eventId')
    const search = ui.get('search')

    let { events } = this.props

    let editableEvent = eventId ? events.get(eventId) : null

    if (search) {
      events = events.filter(event => {
        let fullText = [
          event.summary,
          event.description,
          event.location,
          (event._tags || []).join(' ')
        ].join(' ').toLowerCase()
        return fullText.includes(search)
      })
    }

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
          <header className="main-header">
            <div className="header-left">
              <h1>BC Planner</h1>
              <button className="event-form-open" disabled={eventFormVisible} onClick={actions.openEventForm}>Add Event +</button>
            </div>
            <div className="header-right">
              <input
                onChange={::this.changeSearch}
                placeholder="search"
                type="search"
                value={search} />
            </div>
          </header>
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
