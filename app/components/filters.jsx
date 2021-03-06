import '../styles/filters'

import React, { Component, PropTypes } from 'react'
import { Map, Set } from 'immutable'
import cx from 'classnames'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import * as actions from '../actions'
import { lastUpdates } from '../reducers/events'
import { buildMonthsRange, formatAgo } from '../utils/date'

import clubbers from './../constants/clubbers'
import Gravatar from './gravatar'


class Filters extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    confirmed: PropTypes.number.isRequired,
    filters: PropTypes.instanceOf(Map).isRequired,
    invoiced: PropTypes.number.isRequired,
    lastUpdate: PropTypes.number.isRequired,
    lastUpdateEvents: PropTypes.instanceOf(Map),
    nbMonths: PropTypes.number.isRequired,
    tags: PropTypes.instanceOf(Set),
    visibleClubbers: PropTypes.instanceOf(Set).isRequired,
    withTags: PropTypes.instanceOf(Set).isRequired
  }

  shouldComponentUpdate (nextProps) {
    if (process.env.NODE_ENV === 'development') {
      if (this.props.filters.equals(nextProps.filters) !== (this.props.filters === nextProps.filters)) {
        console.warn('Filters.filters: EQUAL BUT NOT SAME REF')
      }
      if (this.props.tags.equals(nextProps.tags) !== (this.props.tags === nextProps.tags)) {
        console.warn('Filters.tags: EQUAL BUT NOT SAME REF')
      }
      if (this.props.visibleClubbers.equals(nextProps.visibleClubbers) !== (this.props.visibleClubbers === nextProps.visibleClubbers)) {
        console.warn('Filters.visibleClubbers: EQUAL BUT NOT SAME REF')
      }
      if (this.props.withTags.equals(nextProps.withTags) !== (this.props.withTags === nextProps.withTags)) {
        console.warn('Filters.withTags: EQUAL BUT NOT SAME REF')
      }
    }

    return this.props.confirmed !== nextProps.confirmed
        || this.props.invoiced !== nextProps.invoiced
        || this.props.lastUpdate !== nextProps.lastUpdate
        || this.props.nbMonths !== nextProps.nbMonths
        || this.props.filters !== nextProps.filters
        || this.props.tags !== nextProps.tags
        || this.props.visibleClubbers !== nextProps.visibleClubbers
        || this.props.withTags !== nextProps.withTags
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
    const { actions, filters } = this.props

    return (
      <label>
        <input
          checked={filters.get(filter)}
          onChange={() => actions.toggleFilter(filter)}
          type="checkbox" />
        {label}
      </label>
    )
  }

  renderMonthsFilter () {
    const { actions, nbMonths } = this.props

    const onChange = e => {
      if (e.target.value) {
        const nbMonths = Number(e.target.value)
        setTimeout(() => {
          actions.changeNbMonths(nbMonths)
        }, 50)
      }
    }

    return (
      <label>
        <input
          max={12}
          min={1}
          onChange={onChange}
          type="number"
          value={nbMonths} />
        months
      </label>
    )
  }

  tagCheckbox (tag) {
    const { actions, withTags } = this.props
    const checked = withTags.includes(tag)

    return (
      <label className={cx('tag-filter', { active: checked })} key={tag}>
        <input
          checked={checked}
          onChange={() => actions.toggleTag(tag)}
          type="checkbox" />
        {tag}
      </label>
    )
  }

  // fieldsets

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
        <label style={{ 'fontWeight': confirmed === 1 ? 'bold' : 'normal' }}>✓Yes</label>
      </fieldset>
    )
  }

  renderInvoicedFilter () {
    const { actions, invoiced } = this.props

    return (
      <fieldset className="invoiced-filter">
        <legend>€ Invoiced?</legend>
        <label style={{ 'fontWeight': invoiced === -1 ? 'bold' : 'normal' }}>No</label>
        <label>
          <input
            max="1"
            min="-1"
            onChange={e => actions.changeInvoiced(Number(e.target.value))}
            type="range"
            value={invoiced} />
        </label>
        <label style={{ 'fontWeight': invoiced === 1 ? 'bold' : 'normal' }}>✓Yes</label>
      </fieldset>
    )
  }

  renderTagsFilter () {
    const tags = this.props.tags.toArray().sort()

    return (
      <fieldset className="tags-filter">
        <legend>Tags ({tags.length})</legend>
        {tags.map(::this.tagCheckbox)}
      </fieldset>
    )
  }

  renderUpdateFilter () {
    const { actions, lastUpdate, lastUpdatedEvents } = this.props

    const lastEvent = lastUpdatedEvents.toArray()[0] || {}

    return (
      <fieldset className="update-filter">
        <legend><a href="#last-updates" title={lastEvent.updated}>Last update {formatAgo(lastEvent.updated)}</a></legend>
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
        {this.renderInvoicedFilter()}
        {this.renderUpdateFilter()}
        {this.renderTagsFilter()}
      </form>
    )
  }

}


export default connect(
  // TODO memoize?
  ({ events, tags, ui }) => ({
    confirmed: ui.get('confirmed'),
    invoiced: ui.get('invoiced'),
    filters: ui.get('filters'),
    lastUpdate: ui.get('lastUpdate'),
    lastUpdatedEvents: lastUpdates(events),
    nbMonths: buildMonthsRange(ui.get('startMonth'), ui.get('endMonth')).length,
    tags,
    visibleClubbers: ui.get('visibleClubbers'),
    withTags: ui.get('withTags')
  }),
  dispatch => ({ actions: bindActionCreators(actions, dispatch) })
)(Filters)
