import '../styles/month'

import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../actions'

import { filteredEvents, monthEvents } from '../reducers/events'
import { isSameMonth, buildMonthDaysRange, formatMonth } from '../utils/date'

import Day from './day'


class Month extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    nbEvents: PropTypes.number.isRequired,
    date: PropTypes.instanceOf(Date).isRequired
  }

  shouldComponentUpdate (nextProps) {
    return !isSameMonth(this.props.date, nextProps.date)
  }

  render () {
    const { nbEvents, date } = this.props
    const dates = buildMonthDaysRange(date)

    return (
      <div className="month">
        <header className="month-title">{formatMonth(date)} ({nbEvents})</header>
        {dates.map(d => <Day date={d} key={String(d)} />)}
      </div>
    )
  }

}


export default connect(
  ({ events, ui }, { date }) => ({
    date,
    nbEvents: monthEvents(filteredEvents(events, ui), date).count()
  }),
  dispatch => ({ actions: bindActionCreators(actions, dispatch) })
)(Month)
