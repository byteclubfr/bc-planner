import '../styles/fx.styl'

import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { Map, Set } from 'immutable'
import moment from 'moment'

import clubbers from '../constants/clubbers'
import { buildMonthsRange } from '../utils/date'

// child components
import EventForm from './event-form'
import Filters from './filters'
import LastUpdates from './last-updates'
import MainHeader from './main-header'
import MainLoader from './main-loader'
import MonthList from './month-list'

export default class App extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    events: PropTypes.instanceOf(Map).isRequired,
    tags: PropTypes.instanceOf(Set).isRequired,
    ui: PropTypes.instanceOf(Map).isRequired
  }

  closeEventForm () {
    if (!this.props.ui.toObject().eventFormVisible) return
    this.props.actions.closeEventForm()
  }

  render () {
    const { actions, tags, ui } = this.props
    const { startMonth, endMonth, eventFormVisible, fetching } = ui.toObject()

    const range = buildMonthsRange(startMonth, endMonth)

    // destructure from ui reducer
    const confirmed = ui.get('confirmed')
    const eventId = ui.get('eventId')
    const filters = ui.get('filters')
    // <select> value
    const lastUpdate = ui.get('lastUpdate')
    const searchQuery = ui.get('searchQuery')
    const visibleClubbers = ui.get('visibleClubbers')
    const withTags = ui.get('withTags')

    let { events } = this.props
    let filteredEvents = events

    let editableEvent = eventId ? events.get(eventId) : null

    if (visibleClubbers.count() != clubbers.count() || withTags.count() || confirmed || lastUpdate) {
      let now = moment()
      filteredEvents = events.filter(event => {
        let tags = event._tags || []
        let hasClubber = Boolean(visibleClubbers.intersect(event._clubbers).count())
        let hasTag = !withTags.count() || withTags.intersect(tags).count() === withTags.count()
        let c = !confirmed || (event._confirmed && confirmed === 1) || (!event._confirmed && confirmed === -1)
        let delta = !lastUpdate ? 0 : Math.abs((now - moment(event.updated)) / 1000)
        return hasClubber && hasTag && c && (!delta || delta <= lastUpdate)
      })
    }

    if (searchQuery) {
      filteredEvents = filteredEvents.filter(event => {
        let fullText = [
          event.summary,
          event.description,
          event.location,
          (event._tags || []).join(' ')
        ].join(' ').toLowerCase()
        return fullText.includes(searchQuery)
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
          <MainHeader
            eventFormVisible={eventFormVisible}
            events={events}
            filteredEvents={filteredEvents}
            searchQuery={searchQuery} />
          <Filters
            actions={actions}
            confirmed={confirmed}
            filters={filters}
            lastUpdate={lastUpdate}
            nbMonths={range.length}
            tags={tags}
            visibleClubbers={visibleClubbers}
            withTags={withTags} />
          <MonthList
            actions={actions}
            events={filteredEvents}
            filters={filters}
            range={range}
            visibleClubbers={visibleClubbers}
            withTags={withTags} />
          <LastUpdates events={events} />
        </main></div></div>
      </div>
    )
  }

}
