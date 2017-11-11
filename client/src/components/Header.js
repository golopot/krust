import Preact, {Component} from 'preact'
import pathToResources from '../pathToResources'
import store from '../store'
import Plink from './Plink'

class PlateDropdown extends Component{
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

  componentDidMount(){

  }

  render(){

    const onTouchSummary = () => this.setState({open: !this.state.open})
    const onClickDetails = (ev) => {
      !ev.target.classList.contains('details') && this.setState({open: false})
    }

    const openess = this.state.open ? ' open' : ''
    return (
      <div class='plates-dropdown'
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <div class='dropdown-summary' onTouchStart={onTouchSummary}>
          Menu
        </div>
        <div class={'details' + openess} onClick={onClickDetails}>
          <div>關於</div>
          <div>設定</div>
          <div>登出</div>
          <Plink to='/plates'>全部看板</Plink>
          <div>Cats</div>
          <div>Loris</div>
          <div>Tarsier</div>
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
          {plateName
            ? <Plink to={`/plate/${plateName}`}>{plateName}</Plink>
            : <a href="/">Potato</a>
          }

        </div>
      </div>

      <div id='header-right'>
        <PlateDropdown />
      </div>
    </header>
  )
}
export default Header
