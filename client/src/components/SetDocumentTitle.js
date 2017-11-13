import Preact, {Component} from 'preact'
export default class SetDocumentTitle extends Component{

	componentDidMount(){
		document.title = this.props.title || ''
	}

	render(){
		return null
	}
}
