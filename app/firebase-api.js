import firebase from 'firebase'
import { fetchedContacts } from './actions'

const config = {
  apiKey: "AIzaSyCS59sBc34YKrQHL4-FYHb03r_n6Xe9yOk",
  authDomain: "byteclub.firebaseapp.com",
  databaseURL: "https://byteclub.firebaseio.com"
}


export default {
  init (dispatch) {
    firebase.initializeApp(config)
    const provider = new firebase.auth.GoogleAuthProvider()

    firebase.auth().signInWithPopup(provider)
    .then((result) => {

      firebase.database().ref('contacts').once('value')
      .then((snapshot) => {
        dispatch(fetchedContacts(snapshot.val()))
      })
      .catch(::console.error)

    })
    .catch(::console.error)
  }
}



