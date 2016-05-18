import 'loaders.css/loaders.css'
import React from 'react'
import { Loader } from 'react-loaders'

export default class MainLoader extends React.Component {

  constructor (props) {
    super(props)
  }

  shouldComponentUpdate () {
    return false
  }

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
