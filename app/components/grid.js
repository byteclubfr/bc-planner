import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

class Grid extends Component {
  render () {
    if (!this.props.events) return null

    const events = this.props.events.toArray().sort((a, b) => {
      if (a.end > b.end) return -1
      if (a.end < b.end) return 1
      return 0
    })

    return (
      <table>
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>Title</th>
            <th>Start</th>
            <th>End</th>
            <th>Location</th>
            <th>Tags</th>
          </tr>
        </thead>
        <tbody>
        { events.map((evt, k) =>
          <tr key={ evt.id }>
            <td>{ k }</td>
            <td>{ evt.id }</td>
            <td>{ evt.title }</td>
            <td>{ evt.start }</td>
            <td>{ evt.end }</td>
            <td>{ evt.location }</td>
            <td>{ evt._tags.join(', ') }</td>
          </tr>
        ) }
        </tbody>
      </table>
    )
  }

}
export default connect(
  ({ events }) => ({ events })
)(Grid)
