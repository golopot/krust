import Preact from 'preact'
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'

import store from '../store'
import Story from './Story'
import StoryList from './StoryList'
import {CreateStory} from './StoryForm'
import Login from './Login'
import Profile from './Profile'
import PlateList from './PlateList'
import PlateTags from './PlateTags'
import PlateRules from './PlateRules'
import Plate from './Plate'
import User from './User'
import Index from './Index'
import Header from './Header'
import SideEffect from './SideEffect'

const App = () => (
  <Router>
    <div id='react-body'>
      <Route component={Header} />
      <Route exact path="/" component={Index}/>
      <Route path="/u/:user" component={User}/>
      <Route path="/p/:story" component={Story}/>
      <Route exact path="/plate/:plate" component={Plate}/>
      <Route path="/plate/:plate/tags" component={PlateTags}/>
      <Route path="/plate/:plate/rules" component={PlateRules}/>
      <Route path="/login" component={Login}/>
      <Route path="/submit/:plate" component={CreateStory}/>
      <Route path="/profile" component={Profile}/>
      <Route path="/plates" component={PlateList}/>
      <Route component={SideEffect} />
    </div>
  </Router>
)

export default App
