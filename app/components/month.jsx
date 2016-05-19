import '../styles/month'

import React, { Component, PropTypes } from 'react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../actions'

import { filteredEvents, monthEvents } from '../reducers/events'
import { buildMonthDaysRange, formatMonth } from '../utils/date'

import Day from './day'


class Month extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    nbEvents: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return !this.props.date !== nextProps.date
  }

  render () {
    const { nbEvents } = this.props
    const date = new Date(this.props.date)
    const dates = buildMonthDaysRange(date)

    return (
      <div className="month">
        <header className="month-title">{formatMonth(date)} ({nbEvents})</header>
        {dates.map(d => <Day date={d} key={d} />)}
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
