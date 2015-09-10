import '../styles/fx.styl'

import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'
import { Map, Set } from 'immutable'

import clubbers from '../constants/clubbers'
import { buildMonthsRange } from '../utils/date'

import EventForm from './event-form'
import Filters from './filters'
import MainHeader from './main-header'
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

  render () {
    const { actions, tags, ui } = this.props
    const { startMonth, endMonth, eventFormVisible, fetching } = ui.toObject()

    const range = buildMonthsRange(startMonth, endMonth)
    const filters = ui.get('filters')
    const visibleClubbers = ui.get('visibleClubbers')
    const withTags = ui.get('withTags')
    const eventId = ui.get('eventId')
    const search = ui.get('search')
    const confirmed = ui.get('confirmed')

    let { events } = this.props
    let filteredEvents = events

    let editableEvent = eventId ? events.get(eventId) : null

    if (visibleClubbers.count() != clubbers.count() || withTags.count() || confirmed) {
      filteredEvents = events.filter(event => {
        let tags = event._tags || []
        let hasClubber = Boolean(visibleClubbers.intersect(event._clubbers).count())
        let hasTag = !Boolean(withTags.count()) || withTags.intersect(tags).count() === withTags.count()
        let c = !confirmed || (event._confirmed && confirmed === 1) || (!event._confirmed && confirmed === -1)
        console.log(hasClubber, hasTag, c)
        return hasClubber && hasTag && c
      })
    }

    if (search) {
      filteredEvents = filteredEvents.filter(event => {
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
          <MainHeader
            actions={actions}
            eventFormVisible={eventFormVisible}
            events={events}
            filteredEvents={filteredEvents}
            search={search} />
          <Filters
            actions={actions}
            confirmed={confirmed}
            filters={filters}
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
        </main></div></div>
      </div>
    )
  }

}
