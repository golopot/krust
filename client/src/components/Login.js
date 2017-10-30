import Preact from 'preact'
import {Component} from 'preact'
import {Link} from 'react-router-dom'
import {formToObj} from '../utils'
import Cookies from 'js-cookie'


class LoginForm extends Component{

  constructor(props){
    super(props)
    this.onSubmitLogin = this.onSubmitLogin.bind(this)
  }


  onSubmitLogin(ev){
    ev.preventDefault()
    const form = new FormData(ev.target)
    this.setState({loading: true})
    fetch('/api/login', {
      method: 'post',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(formToObj(form))
    })
      .then( r => r.json())
      .then( r => {
        if(r.data && r.data.authtoken){
          Cookies.set('authtoken', r.data.authtoken)
          window.location = '/'
        }
        else{
          this.setState({erroring: true})
        }
      })
  }

  render(){
    const {loading, erroring} = this.state
    return (
      <form id='login-form' onSubmit={this.onSubmitLogin}>
        <div>Log in</div>
        <input name='username' type='text' autoComplete='username'
          maxLength='20' placeholder="username"
        />
        <input name='password' type='password' autoComplete='current-password'
          placeholder="password"
        />
        <button disabled={loading}>Submit</button>
        { loading && <span>loading...</span>}
        { erroring && <span style='color:red'>Error</span>}
      </form>
    )
  }
}


class SignupForm extends Component{

  constructor(props){
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }


  onSubmit(ev){
    ev.preventDefault()
    const form = new FormData(ev.target)
    this.setState({loading: true})
    fetch('/api/signup', {
      method: 'post',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(formToObj(form))
    })
      .then( r => r.json())
      .then( r => {
        if(r.data){
          this.setState({created: true})
        }
        else{
          this.setState({erroring: true})
        }
      })
  }

  render(){
    const {created, erroring} = this.state
    return (
      <form id='signup-form' onSubmit={this.onSubmit}>
        <div>Create a new account</div>
        <input name='newUsername' type='text' maxLength='20' placeholder="username" />
        <input name='newPassword' type='password'
          autoComplete='new-password' placeholder="password"
        />
        <input name='verify-password' type='password'
          autoComplete='new-password' placeholder="verify password "
        />
        <input name='email' type='email' placeholder="email " />
        <button>Submit</button>
        {created && <span>Account is created.</span>}
        {erroring && <span>Error</span>}
      </form>

    )
  }
}

class Login extends Component{

  constructor(props){
    super(props)
  }

  render(){
    return (
      <section className='login-section'>
        <LoginForm />
        <hr />
        <SignupForm />
        <hr />
      </section>
    )
  }

}


export default Login
