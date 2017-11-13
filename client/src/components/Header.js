import Preact, {Component} from 'preact'
import pathToResources from '../pathToResources'
import store from '../store'
import Plink from './Plink'
import Cookies from 'js-cookie'
import {getUsername} from '../utils'


class Menu extends Component{
  constructor(){
    super()
    this.state.open = false
    this.onMouseEnter = this.onMouseEnter.bind(this)
    this.onMouseLeave = this.onMouseLeave.bind(this)
  }

  onMouseEnter(){
    this.setState({open: true})
  }

  onMouseLeave(){
    this.setState({open: false})
  }

  onClickLogout(){
    Cookies.remove('authtoken', {path: '/'})
    window.location.href = '/'
  }

  componentDidMount(){

  }

  render(){

    const onTouchSummary = () => this.setState({open: !this.state.open})
    const onClickDetails = (ev) => {
      ev.target.tagName === 'A' && this.setState({open: false})
    }

    const openess = this.state.open ? ' open' : ''
    return (
      <div class='plates-dropdown'
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <div class='dropdown-summary' onTouchStart={onTouchSummary}>
          選單
        </div>
        <div class={'details' + openess} onClick={onClickDetails}>
          {
            getUsername()
            ? <div><a onClick={this.onClickLogout}>登出</a></div>
            : <div><Plink to='/login'>登入</Plink></div>
          }
          <div><Plink to='/plates'>全部看板</Plink></div>
        </div>
      </div>
    )
  }
}

const Header = ({location}) => {

  const path = location.pathname + location.search
  let plateName = ''

  if(/^\/p\//.test(path)){
    const data = store.resources[pathToResources(path)[0]]
    if(!data) console.error('Resource loading failure.')
    plateName = data.story.plate
  }
  else if( /^\/plate\//.test(path)){
    const data = store.resources[pathToResources(path)[0]]
    if(!data) console.error('Resource loading failure.')
    plateName =  data.plateName
  }

  return (
    <header>
      <div id='header-left'>
        <div id='logo'>
          <Plink to="/">Krust</Plink>
          {plateName && <span class='separator'>/</span>}
          {plateName && <Plink to={`/plate/${plateName}`}>{plateName}</Plink>}
        </div>
      </div>

      <div id='header-right'>
        <Menu />
      </div>
    </header>
  )
}
export default Header
