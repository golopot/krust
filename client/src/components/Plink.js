/*
	Promised Link
	The click handler fetch the resources and then navigate.
	The point of all of these hassles is to prevent FOUC.
*/

import { withRouter } from 'react-router-dom'
import Preact from 'preact'
import {Component} from 'preact'
import PropTypes from 'prop-types'
import promisedNavigate from '../promisedNavigate'
import store from '../store'

class Plink extends Component{

	// TODO deal with furious clicking
	// TODO indicate "connecting" after clicking
	// TODO What happens when link href is current href?

	onClick(ev){
		const {to, history} = this.props
		ev.preventDefault()
		promisedNavigate(to, history)
	}


	render(){
		const {to, history, match, location, ...props} = this.props
		return <a
			{...props}
			href={this.props.to}
			onClick={this.onClick.bind(this)}
		>
			{this.props.children}
		</a>
	}
}


export default withRouter(Plink)
