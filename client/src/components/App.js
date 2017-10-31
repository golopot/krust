import Preact from 'preact'
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'

import Story from './Story'
import StoryList from './StoryList'
import StoryForm from './StoryForm'
import Login from './Login'
import Profile from './Profile'
import PlateList from './PlateList'

const Header = () => (
  <header>
    <div id='header-left'>
      <div id='logo'>
        <a href="/"><span>Potato</span></a>
      </div>
    </div>

    <div id='header-right'>
      <a href='/submit'>Submit</a>
      {
        /authtoken/.test(document.cookie) ?
          <a href='/profile' id='login-thing'>Profile</a> :
          <a href='/login' id='login-thing'>Login</a>
      }
      <a href='/plates'>Plates</a>
    </div>
  </header>
)


const App = () => (
  <Router>
    <div id='content'>
      <Header />
      <section id='message-popup'></section>
      <Route exact path="/" component={StoryList}/>
      <Route path="/p/:story" component={Story}/>
      <Route path="/login" component={Login}/>
      <Route path="/submit" component={StoryForm}/>
      <Route path="/profile" component={Profile}/>
      <Route path="/plates" component={PlateList}/>
    </div>
  </Router>
)

export default App
