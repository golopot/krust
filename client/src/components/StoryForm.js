import Preact from 'preact'
import {Component} from 'preact'
import {
	BrowserRouter as Router,
	Route,
	Link
} from 'react-router-dom'
import store from '../store'

import {formToObj} from '../utils'


const Loading = () => <span>Loading...</span>

const status = {
	IDLE: 0,
	WAIT: 1,
}

class StoryForm extends Component{

	constructor(props){
		super(props)
		this.setState( {status: status.IDLE} )
		this.onSubmit = this.onSubmit.bind(this)
	}

	onSubmit(ev){
		ev.preventDefault()
		this.setState( {status: status.WAIT} )
		const form = formToObj(new FormData(ev.target))
		const body = Object.assign(form, {})

		fetch('/api/create-story', {
			method: 'post',
			credentials: 'include',
			headers: {'content-type': 'application/json', 'X-CSRF-Prevention': 1},
			body: JSON.stringify(body),
		})
			.then( x => x.json() )
			.then( x => {
				this.setState( {status: status.IDLE} )
			})
			// .then( () => window.location = window.location )
			.catch( e => console.error(e) )
	}

	render(){
		return (
			<div>
				<div>Submit Post</div>
				<form id='create-post-form' onSubmit={this.onSubmit}>
					<div><input name='title' placeholder='Title' /></div>
					<div><textarea name='content' placeholder='Content' /></div>
					<button type='submit'>Submit</button>
				</form>
			</div>
		)
	}
}

export default StoryForm
