import '../styles/filters'

import React, { Component } from 'react'

import clubbers from './../constants/clubbers'
import Gravatar from './gravatar'

export default class Filters extends Component {
  clubberCheckbox (clubber, name) {
    return (
      <label key={name} style={{backgroundColor: clubber.color}}>
        <input type="checkbox" />
        <Gravatar clubberName={name} />
        {name}
      </label>
    )
  }

  render () {
    return (
      <form className="filters">
        <strong>Filter by clubber</strong>
        {clubbers.map(::this.clubberCheckbox).toArray()}
      </form>
    )
  }

}

