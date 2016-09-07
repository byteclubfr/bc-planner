import '../styles/fx.styl'

import React, { Component, PropTypes } from 'react'
import classNames from 'classnames'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../actions'

// child components
import Contacts from './contacts'
import EventForm from './event-form'
import Filters from './filters'
import LastUpdates from './last-updates'
import MainHeader from './main-header'
import MainLoader from './main-loader'
import MonthList from './month-list'


class App extends Component {

  static propTypes = {
    actions: PropTypes.object.isRequired,
    fetching: PropTypes.bool.isRequired,
    eventFormVisible: PropTypes.bool.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return this.props.fetching !== nextProps.fetching
        || this.props.eventFormVisible !== nextProps.eventFormVisible
  }

  closeEventForm () {
    if (!this.props.eventFormVisible) {
      return
    }
    this.props.actions.closeEventForm()
  }

  render () {
    const { fetching, eventFormVisible } = this.props

    return (
      <div className={classNames('container', 'fx-container', { 'fx-menu-open': eventFormVisible })}>
        {fetching ? <MainLoader /> : null}
        <EventForm />
        <div className="fx-pusher" onClick={::this.closeEventForm}>
          <div className="fx-content">
            <main className="fx-content-inner">
              <MainHeader />
              <Filters />
              <MonthList />
              <div className="cols">
                <LastUpdates />
                <Contacts />
              </div>
            </main>
          </div>
        </div>
      </div>
    )
  }

}


export default connect(
  ({ ui }) => ({
    fetching: ui.get('fetching'),
    eventFormVisible: ui.get('eventFormVisible')
  }),
  dispatch => ({ actions: bindActionCreators(actions, dispatch) })
)(App)
