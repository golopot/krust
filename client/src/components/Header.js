import Preact from 'preact'
import pathToResources from '../pathToResources'
import store from '../store'
import Plink from './Plink'
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
          {plateName
            ? <Plink to={`/plate/${plateName}`}>{plateName}</Plink>
            : <a href="/">Potato</a>
          }

        </div>
      </div>

      <div id='header-right'>
        <Plink to='/plates'>Plates</Plink>
        {
          /authtoken/.test(document.cookie) ?
            <Plink to='/profile' id='login-thing'>Profile</Plink> :
            <Plink to='/login' id='login-thing'>Login</Plink>
        }
      </div>
    </header>
  )
}
export default Header
