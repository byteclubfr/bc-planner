import '../styles/day'

import React, { Component } from 'react'

import clubbers from './../constants/clubbers'

export default class Gravatar extends Component {

  render () {
    const { clubberName } = this.props

    return clubberName ? <img alt={'gravatar ' + clubberName} src={'http://gravatar.com/avatar/' + clubbers.get(clubberName).gravatar + '?s=20'} /> : <span />
  }

}

