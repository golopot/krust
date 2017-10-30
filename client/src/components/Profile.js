import {Component} from 'preact'
import Preact from 'preact'
import {
	BrowserRouter as Router,
	Route,
	Link
} from 'react-router-dom'


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
					<div>Email</div>
					<span>{p.email}</span>
				</div>

				<div>
					<div>Stories you submit</div>
				</div>

				<div>
					<div>Log out</div>
					<button class='logout' onClick={this.onClickLogout}>logout</button>
				</div>

			</div>
		)
	}

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
