import '../styles/month-list'

import React, { Component, PropTypes } from 'react'
import { Map, Set } from 'immutable'

import Month from './month'


export default class MonthList extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    events: PropTypes.instanceOf(Map),
    filters: PropTypes.instanceOf(Map).isRequired,
    range: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    visibleClubbers: PropTypes.instanceOf(Set).isRequired,
    withTags: PropTypes.instanceOf(Set).isRequired
  }

  shouldComponentUpdate (nextProps) {
    var { events, range } = this.props
    var newRange = range.join() !== nextProps.range.join()
    var noNewEvents = !events.count() && !nextProps.events.count()
    return newRange || !noNewEvents
  }

  render () {
    return (
      <div className="month-list">
        <button
          className="month-list-previous"
          onClick={() => this.props.actions.changeStartMonth('previous')}
          title="◀ Prev month">◀</button>
        {this.props.range.map(month =>
          <Month
            actions={this.props.actions}
            date={month}
            events={this.props.events}
            filters={this.props.filters}
            key={month}
            visibleClubbers={this.props.visibleClubbers}
            withTags={this.props.withTags} />
        )}
        <button
          className="month-list-next"
          onClick={() => this.props.actions.changeStartMonth('next')}
          title="Next month ▶">▶</button>
      </div>
    )
  }

}
