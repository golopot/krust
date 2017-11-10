import Preact from 'preact'
import {Component} from 'preact'
import {Link} from 'react-router-dom'
import store from '../store'

import {formToObj} from '../utils'
import pJump from '../promisedNavigate'


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
    const body = Object.assign(form, {
      plate: this.props.match.params.plate,
    })

    fetch('/api/create-story', {
      method: 'post',
      credentials: 'include',
      headers: {'content-type': 'application/json', 'X-CSRF-Prevention': 1},
      body: JSON.stringify(body),
    })
      .then( r => r.json() )
      .then( r => {
        if(r.error){
          this.setState({error: true})
        }
        else{
          pJump(`/p/${r.id}`, this.props.history)
        }
      })
      .catch( e => console.error(e) )
  }

  render(){
    const {plate} = this.props.match.params
    return (
      <div>
        <div>Submit to {plate}</div>
        <form id='create-post-form' onSubmit={this.onSubmit}>
          <div><input name='title' placeholder='Title' /></div>
          <div><textarea name='content' placeholder='Content' /></div>
          <button type='submit'>Submit</button>
          {this.state.error && <span>Error</span>}
        </form>
      </div>
    )
  }
}

export default StoryForm
