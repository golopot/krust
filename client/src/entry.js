import config from './config'
import Preact from 'preact'
import store from './store'
import App from './components/App'
import KeyboardNavigator from './KeyboardNavigator'

require('preact/devtools')


window.INIT_FETCHES
.then( resources => {
  store.resources = Object.assign({}, resources)
  store.userVotes = resources['/api/user-votes']
    ? userVotesToMap(resources['/api/user-votes'].userVotes||[])
    : new Map
  Preact.render(<App />, document.body)
})
.catch(console.error)

const userVotesToMap = (votesList) => {
  const votes = new Map()
  for(let {direction, target, target_type} of votesList){
    votes.set(`${target_type}${target}`, direction)
  }
  return votes
}

const keyboardNavigator = new KeyboardNavigator()
window.store = store
