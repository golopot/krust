import Preact, {Component} from 'preact'
import PropTypes from 'prop-types'
export default class SetDocumentTitle extends Component{

  componentDidMount(){
    document.title = this.props.title || ''
  }

  render(){
    return null
  }
}

SetDocumentTitle.propTypes = {
  title: PropTypes.string.isRequired,
}
