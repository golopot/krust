import Preact, {Component} from 'preact'
import PropTypes from 'prop-types'
import Cookies from 'js-cookie'

class Profile extends Component{

  constructor(props){
    super(props)
  }

  onClickLogout(){
    Cookies.remove('authtoken', {path: '/'})
    window.location.href = '/'
  }

  render(){
    const p = this.props.profile || {}
    return (
      <div class='profile'>

        <div>Profile and settings</div>

        <div>
          <div>Username</div>
          <span>{p.username}</span>
        </div>

        <div>
          <div>Stories you submit</div>
        </div>

        <div>
          <button class='logout' onClick={this.onClickLogout}>logout</button>
        </div>

      </div>
    )
  }

}
Profile.propTypes = {
  profile: PropTypes.object.isRequired,
}

class Container extends Component{

  componentDidMount(){
    fetch('/api/profile', {
      method: 'get',
      credentials: 'include',
      headers: {'X-CSRF-Prevention': 1},
    })
      .then( r => r.json())
      .then( r => {
        this.setState({profile: r})
      })
  }

  render(){
    return <Profile profile={this.state.profile} />
  }
}




export default Container
