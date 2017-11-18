/*
	Promised Link
	The click handler fetch the resources and then navigate.
	The point of all of these hassles is to prevent FOUC.
*/

import { withRouter } from 'react-router-dom'
import Preact, {Component} from 'preact'
import PropTypes from 'prop-types'
import promisedNavigate from '../promisedNavigate'

class Plink extends Component{

  // TODO deal with furious clicking
  // TODO indicate "connecting" after clicking
  // TODO What happens when link href is current href?

  onClick(ev){
    const {to} = this.props
    ev.preventDefault()
    promisedNavigate(to)
  }


  render(){
    // eslint-disable-next-line no-unused-vars
    const {to, history, match, location, ...props} = this.props
    return <a
      {...props}
      href={to}
      onClick={this.onClick.bind(this)}
    >
      {this.props.children}
    </a>
  }
}

Plink.propTypes = {
  to: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  children: PropTypes.object,
}

export default withRouter(Plink)
