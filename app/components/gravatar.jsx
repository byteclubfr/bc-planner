import React, { Component, PropTypes } from 'react'

import clubbers from './../constants/clubbers'

export default class Gravatar extends Component {
  static propTypes = {
    email: PropTypes.string.isRequired
  }

  shouldComponentUpdate (nextProps) {
    return this.props.email !== nextProps.email
  }

  render () {
    const { email } = this.props

    return email ? <img alt={'gravatar ' + email} src={'http://gravatar.com/avatar/' + clubbers.get(email).gravatar + '?s=20'} /> : <span />
  }

}

