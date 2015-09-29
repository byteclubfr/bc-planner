import '../styles/filters'

import React, { Component, PropTypes } from 'react'
import { Map, Set } from 'immutable'

import clubbers from './../constants/clubbers'
import Gravatar from './gravatar'

export default class Filters extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    confirmed: PropTypes.number.isRequired,
    filters: PropTypes.instanceOf(Map).isRequired,
    lastUpdate: PropTypes.number.isRequired,
    nbMonths: PropTypes.number.isRequired,
    tags: PropTypes.instanceOf(Set),
    visibleClubbers: PropTypes.instanceOf(Set).isRequired,
    withTags: PropTypes.instanceOf(Set).isRequired
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

  tagCheckbox (tag) {
    const { actions, withTags } = this.props

    return (
      <label className="tag-filter" key={tag}>
        <input
          checked={withTags.includes(tag)}
          onChange={() => actions.toggleTag(tag)}
          type="checkbox" />
        {tag}
      </label>
    )
  }

  // fieldset

  renderClubbersFilter () {
    return (
      <fieldset className="clubbers-filter">
        <legend>Clubbers</legend>
        {clubbers.map(::this.clubberCheckbox).toArray()}
      </fieldset>
    )
  }

  renderDisplayOptions () {
    return (
      <fieldset className="display-options">
        <legend>Show</legend>
        {this.renderFilterCheckbox('title', 'Title')}
        {this.renderFilterCheckbox('location', 'Location')}
        {this.renderFilterCheckbox('tags', 'Tags')}
        {this.renderFilterCheckbox('gravatar', 'Avatars')}
        {this.renderFilterCheckbox('bars', 'Bars')}
        {this.renderMonthsFilter()}
      </fieldset>
    )
  }

  renderConfirmedFilter () {
    const { actions, confirmed } = this.props

    return (
      <fieldset className="confirmed-filter">
        <legend>Confirmed?</legend>
        <label style={{ 'fontWeight': confirmed === -1 ? 'bold' : 'normal' }}>No</label>
        <label>
          <input
            max="1"
            min="-1"
            onChange={e => actions.changeConfirmed(Number(e.target.value))}
            type="range"
            value={confirmed} />
        </label>
        <label style={{ 'fontWeight': confirmed === 1 ? 'bold' : 'normal' }}>Yes</label>
      </fieldset>
    )
  }

  renderTagsFilter () {
    const tags = this.props.tags.toArray().sort()

    return (
      <fieldset className="tags-filter">
        <legend>Tags</legend>
        {tags.sort().map(::this.tagCheckbox)}
      </fieldset>
    )
  }

  renderUpdateFilter () {
    const { actions, lastUpdate } = this.props

    return (
      <fieldset className="update-filter">
        <legend><a href="#last-updates">Last update</a></legend>
        <label>
          <select
            onChange={e => actions.changeLastUpdate(Number(e.target.value))}
            value={lastUpdate}>
            <option value="0">All events</option>
            <option value={3600}>Last hour</option>
            <option value={3600 * 6}>Last 6 hours</option>
            <option value={3600 * 24}>Last day</option>
            <option value={3600 * 24 * 7}>Last week</option>
            <option value={3600 * 24 * 14}>Last 2 weeks</option>
            <option value={3600 * 24 * 28}>Last month</option>
          </select>
        </label>
      </fieldset>
    )
  }

  render () {
    return (
      <form className="filters">
        {this.renderClubbersFilter()}
        {this.renderDisplayOptions()}
        {this.renderConfirmedFilter()}
        {this.renderUpdateFilter()}
        {this.renderTagsFilter()}
      </form>
    )
  }

}

