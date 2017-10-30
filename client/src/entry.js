import qs from 'qs'
import config from './config'
import {dq, formToObj} from './utils'
import dateStringify from './dateStringify'
import Preact from 'preact'
import store from './store'
import App from './components/App'

require('preact/devtools');

Promise.all(window.REACT_INIT_LOADER.fetches)
.then( (resources) => {
  store.resources = {}
  for(let i=0; i<resources.length; i++){
    let endpoints = window.REACT_INIT_LOADER.endpoints
    store.resources[endpoints[i]] = resources[i]
  }
  Preact.render(<App />, document.body)
})
.catch(console.error)
