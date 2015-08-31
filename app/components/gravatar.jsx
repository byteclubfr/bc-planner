import '../styles/day'

import React, { Component } from 'react'

import clubbers from './../constants/clubbers'

export default class Gravatar extends Component {

  render () {
    const { clubberEmail } = this.props

    return clubberEmail ? <img alt={'gravatar ' + clubberEmail} src={'http://gravatar.com/avatar/' + clubbers.get(clubberEmail).gravatar + '?s=20'} /> : <span />
  }

}

