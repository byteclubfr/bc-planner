import '../styles/month-list'

import React, { Component, PropTypes } from 'react'
import { Map, Set } from 'immutable'

import Month from './month'


export default class MonthList extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    events: PropTypes.instanceOf(Map),
    filters: PropTypes.instanceOf(Map).isRequired,
    hiddenTags: PropTypes.instanceOf(Set).isRequired,
    range: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    visibleClubbers: PropTypes.instanceOf(Set).isRequired
  }

  render () {
    return (
      <div className="month-list">
        {this.props.range.map(month =>
          <Month
            actions={this.props.actions}
            date={month}
            events={this.props.events}
            filters={this.props.filters}
            hiddenTags={this.props.hiddenTags}
            key={month}
            visibleClubbers={this.props.visibleClubbers} />
        )}
      </div>
    )
  }

}
