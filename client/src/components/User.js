import Preact, {Component} from 'preact'
import PropTypes from 'prop-types'

export default class User extends Component {

  componentDidMount() {
    const {user} = this.props.match.params
    fetch(`/api/user/${user}`)
      .then( r => r.json())
      .then( r => {
        if (r.error) {
          this.setState({error: true})
        }
        else {
          this.setState({user: r})
        }
      })
  }

  render() {
    if (this.state.error) return <div>Error</div>
    if (!this.state.user) return null
    const {username, date_created, points} = this.state.user
    return (
      <section class='user'>
        <div>{username}</div>
        <div>{points} Points</div>
        <div>Member since {date_created}</div>
      </section>
    )
  }
}

User.propTypes = {
  match: PropTypes.object,
}
