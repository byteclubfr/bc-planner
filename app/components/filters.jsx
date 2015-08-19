import '../styles/filters'

import React, { Component, PropTypes } from 'react'
import { Map } from 'immutable'

import clubbers from './../constants/clubbers'
import Gravatar from './gravatar'

export default class Filters extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    filters: PropTypes.instanceOf(Map).isRequired
  }

  clubberCheckbox (clubber, name) {
    return (
      <label key={name} style={{backgroundColor: clubber.color}}>
        <input type="checkbox" />
        <Gravatar clubberName={name} />
        {name}
      </label>
    )
  }

  renderClubbersFilter () {
    return (
      <div>
        <strong>Filter by clubber</strong>
        {clubbers.map(::this.clubberCheckbox).toArray()}
      </div>
    )
  }

  renderFilterCheckbox (filter, label) {
    const { filters } = this.props

    return (
      <label>
        <input
          checked={filters.get(filter)}
          onClick={() => this.props.actions.toggleFilter(filter)}
          type="checkbox" />
        {label}
      </label>
    )
  }

  renderDisplayOptions () {
    return (
      <div>
        <strong>Show</strong>
        {this.renderFilterCheckbox('title', 'Title')}
        {this.renderFilterCheckbox('gravatar', 'Avatars')}
        {this.renderFilterCheckbox('bars', 'Bars')}
      </div>
    )
  }

  render () {
    return (
      <form className="filters">
        {this.renderClubbersFilter()}
        {this.renderDisplayOptions()}
      </form>
    )
  }

}

