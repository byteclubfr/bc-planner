import React, { Component } from 'react'

import clubbers from './../constants/clubbers'

export default class Gravatar extends Component {

  shouldComponentUpdate (nextProps) {
    return this.props.email !== nextProps.email
  }

  render () {
    const { email } = this.props

    return email ? <img alt={'gravatar ' + email} src={'http://gravatar.com/avatar/' + clubbers.get(email).gravatar + '?s=20'} /> : <span />
  }

}

