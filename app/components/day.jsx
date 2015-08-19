import '../styles/day'

import React, { Component, PropTypes } from 'react'

export default class Day extends Component {

  static propTypes = {
    day: PropTypes.number.isRequired
  }

  render () {

    return (
      <div className="day">
        <header className="day-date">{this.props.day}</header>
      </div>
    )
  }

}
