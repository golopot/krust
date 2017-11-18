import Preact from 'preact'
import {formToObj} from '../utils'
import Cookies from 'js-cookie'


const Loading = () => <span>Loading...</span>

const status = {
  IDLE: 0,
  WAIT: 1,
}

class CommentForm extends Preact.Component{

  constructor(props){
    super(props)
    this.setState( {status: status.IDLE} )
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit(ev){
    const {storyId, commentId} = this.props

    ev.preventDefault()
    this.setState( {status: status.WAIT} )
    const form = formToObj(new FormData(ev.target))
    const body = Object.assign(form, {
      storyId,
      commentId,
    })

    fetch('/api/create-comment', {
      method: 'post',
      credentials: 'include',
      headers: {'content-type': 'application/json', 'X-CSRF-Prevention': 1},
      body: JSON.stringify(body),
    })
      .then( x => x.json() )
      .then( () => {
        this.setState( {status: status.IDLE} )
      })
      .then( () => window.location = window.location )
      .catch( e => console.error(e) )

  }

  render(){
    let disabled = {}
    if(this.state.status === status.WAIT || !Cookies.get('authtoken') )
      disabled = {disabled: true}
    const placeHolder = !Cookies.get('authtoken')
      ? 'Log in to comment'
      : 'Write Comment'

    return (
      <form class='comment-form' onSubmit={this.onSubmit}>
        <div><textarea name='content' placeHolder={placeHolder} {...disabled}/></div>
        <div class='bottom'>
          <button {...disabled} >save</button>
          { this.state.status === status.WAIT && <Loading /> }
        </div>
      </form>
    )
  }
}

export default CommentForm
