import '../styles/filters'

import React, { Component, PropTypes } from 'react'

import clubbers from './../constants/clubbers'
import Gravatar from './gravatar'

export default class Filters extends Component {

  render () {

    return (
      <form className="filters">
        <strong>Filter by clubber</strong>
        {Object.keys(clubbers).map(clubberName =>
          <label><input type="checkbox" /><Gravatar clubberName={clubberName} /> {clubberName}</label>
        )}
      </form>
    )
  }

}

