import '../styles/month'

import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import { range, isEqual } from 'lodash/fp'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../actions'

import { monthEvents } from '../reducers/events'

import Day from './day'


class Month extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    nbEvents: PropTypes.number.isRequired,
    date: PropTypes.arrayOf(PropTypes.number).isRequired
  }

  shouldComponentUpdate (nextProps) {
    return !isEqual(this.props.date, nextProps.date)
  }

  render () {
    const { nbEvents, date } = this.props
    const mdate = moment(date)
    const daysInMonth = range(0, mdate.daysInMonth())
    const dates = daysInMonth.map(day => moment(date).date(day + 1))

    return (
      <div className="month">
        <header className="month-title">{mdate.format('MMMM YYYY')} ({nbEvents})</header>
        {dates.map(d =>
          <Day date={d} key={d.format()} />
        )}
      </div>
    )
  }

}


export default connect(
  ({ events, ui }, { date }) => ({
    date,
    nbEvents: monthEvents(events, date).count()
  }),
  dispatch => ({ actions: bindActionCreators(actions, dispatch) })
)(Month)
