import '../styles/filters'

import React, { Component, PropTypes } from 'react'
import { Map, Set } from 'immutable'

import clubbers from './../constants/clubbers'
import Gravatar from './gravatar'

export default class Filters extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    filters: PropTypes.instanceOf(Map).isRequired,
    nbMonths: PropTypes.number.isRequired,
    visibleClubbers: PropTypes.instanceOf(Set).isRequired
  }

  clubberCheckbox (clubber, email) {
    const { actions, visibleClubbers } = this.props

    return (
      <label className="clubber-label" key={email} style={{backgroundColor: clubber.color}}>
        <input
          checked={visibleClubbers.includes(email)}
          onChange={() => actions.toggleClubber(email)}
          type="checkbox" />
        <Gravatar email={email} />
        {clubber.name}
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
          onChange={() => this.props.actions.toggleFilter(filter)}
          type="checkbox" />
        {label}
      </label>
    )
  }

  renderMonthsFilter () {
    return (
      <label>
        <input
          max={12}
          min={1}
          onChange={e => this.props.actions.changeNbMonths(e.target.value)}
          type="number"
          value={this.props.nbMonths} />
        {'months'}
      </label>
    )
  }

  renderDisplayOptions () {
    return (
      <div>
        <strong>Show</strong>
        {this.renderFilterCheckbox('title', 'Title')}
        {this.renderFilterCheckbox('location', 'Location')}
        {this.renderFilterCheckbox('gravatar', 'Avatars')}
        {this.renderFilterCheckbox('bars', 'Bars')}
        {this.renderMonthsFilter()}
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

