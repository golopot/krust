/*
	Promised Link
	The click handler fetch the resources and then navigate.
	The point of all of these hassles is to prevent FOUC.
*/

import { withRouter } from 'react-router-dom'
import Preact from 'preact'
import {Component} from 'preact'
import pathToResources from '../pathToResources'
import store from '../store'

class Plink extends Component{

	// TODO deal with furious clicking
	// TODO indicate "connecting" after clicking

	onClick(ev){
		const {to, history} = this.props
		ev.preventDefault()
		const resources = pathToResources(to).map(
			uri => fetch(uri)
				.then( r => r.json() )
				.then( r => {
					if(r.error){
						throw r.error
					}
					else{
						store.resources[uri] = r
					}
				})
				.catch(console.error)
		)

		Promise.all(resources)
		.then( () => {
			history.push(to)
		})
		.catch(console.error)
	}

	render(){
		return <a href={this.props.to} onClick={this.onClick.bind(this)}>{this.props.children}</a>
	}
}


export default withRouter(Plink)
