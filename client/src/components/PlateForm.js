import Preact from 'preact'
import {Component} from 'preact'
import {Link} from 'react-router-dom'
import store from '../store'

import {formToObj} from '../utils'


const Loading = () => <span>Loading...</span>

const status = {
  IDLE: 0,
  WAIT: 1,
}

class PlateForm extends Component{

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

    fetch('/api/create-plate', {
      method: 'post',
      credentials: 'include',
      headers: {'content-type': 'application/json', 'X-CSRF-Prevention': 1},
      body: JSON.stringify(body),
    })
      .then( x => x.json() )
      .then( r => {
        if(r.error){
          this.setState({error: true})
          throw r.error
        }
        else{
          window.location.href = '/plates'
        }

      })
    // .then( () => window.location = window.location )
      .catch( console.error )
  }

  render(){
    const {error} = this.state
    return (
      <div>
        <div>Create a new plate</div>
        <form id='create-plate-form' onSubmit={this.onSubmit}>
          <div><input name='name' placeholder='name' /></div>
          <div><input name='title' placeholder='title' /></div>
          <div><textarea name='description' placeholder='description' /></div>
          <button type='submit'>Submit</button>
          {error && <span>Error</span>}
        </form>
      </div>
    )
  }
}

export default PlateForm
