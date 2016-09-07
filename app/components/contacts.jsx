import '../styles/contacts'

import React, { Component, PropTypes } from 'react'
import { Map } from 'immutable'

import { connect } from 'react-redux'
import { formatAgo } from '../utils/date'


class Contacts extends Component {

  static propTypes = {
    contacts: PropTypes.instanceOf(Map).isRequired
  }

  render () {
    const contacts = this.props.contacts.toArray().reverse()

    return (
      <section id="contacts">
        <h2>Contacts ({ contacts.length })</h2>
        <ul>
          {contacts.map(c =>
            <li key={c.date} className="contact">
              <strong>{c.firstname} {c.lastname} ({c.email}) - {c.date}</strong>
              <div>{c.message}</div>
            </li>
          )}
        </ul>
      </section>
    )
  }

}


export default connect(
  ({ contacts }) => ({ contacts })
)(Contacts)

