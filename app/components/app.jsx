import React, { Component, PropTypes } from 'react'
import MonthList from './month-list'
import { buildMonthsRange } from '../utils/date'

export default class App extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    events: PropTypes.object.isRequired,
    ui: PropTypes.object.isRequired
  }

  constructor () {
    super()
    this.state = {
      count: 0
    }
  }

  onClick() {
    this.setState({count: this.state.count + 1})
  }

  componentDidMount () {
    this.props.actions.fetchEvents()
  }

  render () {
    const {startMonth, endMonth, fetching} = this.props.ui

    if (fetching) {
      return <strong>Fetching…</strong>
    }

    const range = buildMonthsRange(startMonth, endMonth)

    return  <div>
              <span onClick={::this.onClick}>Count = {this.state.count}</span>
              <MonthList events={this.props.events.events} range={range} />
            </div>
  }

}
