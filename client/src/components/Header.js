import Preact, {Component} from 'preact'
import PropTypes from 'prop-types'
import pathToResources from '../pathToResources'
import Plink from './Plink'
import DropDown from './DropDown'
import Cookies from 'js-cookie'
import {getUsername} from '../utils'
import pageCache from '../pageCache'

class Menu extends Component {
  constructor() {
    super()
    this.state.open = false
    this.toggleOpen = this.toggleOpen.bind(this)
    this.onClickMenu = this.onClickMenu.bind(this)
  }

  onClickLogout(ev) {
    ev.preventDefault()
    Cookies.remove('authtoken', {path: '/'})
    window.location.href = '/'
  }

  onClickMenu(ev) {
    if (ev.target.tagName === 'A') {
      this.toggleOpen()
    }
  }

  toggleOpen() {
    this.setState({open: !this.state.open})
  }

  componentDidMount() {

  }

  render() {

    const isOpen = this.state.open ? ' open' : ''

    if (!getUsername()) {
      return (
        <nav class='menu login'>
          <div class='hamburger'
            onClick={this.toggleOpen}
          >
            登入
          </div>
          <div class={'details' + isOpen}>
            <div><a href='/oauth/google'>by Google</a></div>
            <div><Plink to='/login'>by username/password</Plink></div>
            <div><Plink to='/about'>關於本站</Plink></div>
          </div>
        </nav>
      )
    }
    else {
      return (
        <nav class='menu'>
          <div class='hamburger'
            onClick={this.toggleOpen}
          >
            選單
          </div>
          <div class={'details' + isOpen} onClick={this.onClickMenu}>
            <div><a onClick={this.onClickLogout}>登出</a></div>
            <div><Plink to='/profile'>帳號</Plink></div>
            <div><Plink to='/about'>關於本站</Plink></div>
          </div>
        </nav>
      )
    }
  }
}

const PlatesDropDown = () => {
  const plates = pageCache.get('/api/plate').plates
  const details = plates.map(plate => (
    <Plink to={`/plate/${plate.name}`} key={plate.name}>{plate.name}</Plink>
  ))
  return (
    <DropDown summary={'看板'}>
      {details}
    </DropDown>
  )
}


const Header = ({location}) => {

  const path = location.pathname + location.search
  let plateName = ''

  if (/^\/p\//.test(path)) {
    const data = pageCache.get(pathToResources(path)[0])
    if (!data) console.error('Resource loading failure.')
    plateName = data.story.plate
  }
  else if ( /^\/plate\//.test(path)) {
    const data = pageCache.get(pathToResources(path)[0])
    if (!data) console.error('Resource loading failure.')
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
        <PlatesDropDown />
        <Menu />
      </div>
    </header>
  )
}

Header.propTypes = {
  location: PropTypes.object.isRequired,
}
export default Header
