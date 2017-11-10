import Preact, {Component} from 'preact'
import store from '../store'
export default class SideEffect extends Component{
	constructor(props){
		super(props)
		store.history = this.props.history
		window.app = window.app || {}
		window.app.history = this.props.history
	}
	render(){
		return null
	}
}
