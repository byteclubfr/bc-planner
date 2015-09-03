import 'loaders.css/loaders.css'
import React, { Component } from 'react'
import { Loader } from 'react-loaders'

export default class MainLoader extends Component {

  render () {
    return (
      <div className="main-loader">
        <div className="main-loader-message">
          <h1>Fetching Google events...</h1>
          <Loader type="ball-pulse-sync" />
        </div>
      </div>
    )
  }

}

