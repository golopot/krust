import Preact from 'preact'
import store from './store'
import App from './components/App'
import KeyboardNavigator from './KeyboardNavigator'
import pageCache from './pageCache'

require('preact/devtools')

window.INIT_FETCHES
  .then( resources => {
    for(let [key, value] of Object.entries(resources) ){
      pageCache.set(key, value)
    }
    store.userVotes = resources['/api/user-votes']
      ? userVotesToMap(resources['/api/user-votes'].userVotes||[])
      : new Map()
    document.querySelector('#hack').remove()
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

new KeyboardNavigator()
window.store = store
window.pageCache = pageCache
