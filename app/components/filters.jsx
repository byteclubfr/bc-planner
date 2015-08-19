import '../styles/filters'

import React, { Component } from 'react'

import clubbers from './../constants/clubbers'
import Gravatar from './gravatar'

export default class Filters extends Component {
  render () {
    return (
      <form className="filters">
        <strong>Filter by clubber</strong>
        {clubbers.map((clubber, name) =>
          <label key={name}><input type="checkbox" /><Gravatar clubberName={name} /> {name}</label>
        ).toArray()}
      </form>
    )
  }

}

