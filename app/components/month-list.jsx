import '../styles/month-list'

import React, { Component, PropTypes } from 'react'

import { isEqualWith } from 'lodash/fp'
import { buildMonthsRange, isSameMonth } from '../utils/date'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../actions'

import Month from './month'


class MonthList extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    range: PropTypes.arrayOf(PropTypes.instanceOf(Date)).isRequired
  }

  shouldComponentUpdate (nextProps) {
    if (process.env.NODE_ENV === 'development') {
      if (isEqualWith(isSameMonth, this.props.range, nextProps.range) !== (this.props.range === nextProps.range)) {
        console.warn('MonthList.range: EQUAL BUT NOT SAME REF')
      }
    }

    return !isEqualWith(isSameMonth, this.props.range, nextProps.range)
  }

  render () {
    return (
      <div className="month-list">
        <button
          className="month-list-previous"
          onClick={() => this.props.actions.changeStartMonth('previous')}
          title="◀ Prev month">◀</button>
        {this.props.range.map(month =>
          <Month date={month} key={month} />
        )}
        <button
          className="month-list-next"
          onClick={() => this.props.actions.changeStartMonth('next')}
          title="Next month ▶">▶</button>
      </div>
    )
  }

}


export default connect(
  ({ ui }) => ({
    range: buildMonthsRange(ui.get('startMonth'), ui.get('endMonth'))
  }),
  dispatch => ({ actions: bindActionCreators(actions, dispatch) })
)(MonthList)
