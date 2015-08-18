import React, { Component, PropTypes } from 'react'
import { Map } from 'immutable'
import Month from './month'


export default class MonthList extends Component {

  static propTypes = {
    events: PropTypes.instanceOf(Map),
    range: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired
  }

  render () {
    return (
      <div className="month-list">
        {this.props.range.map(month =>
          <Month events={this.props.events} month={month} />
        )}
      </div>
    )
  }

}
