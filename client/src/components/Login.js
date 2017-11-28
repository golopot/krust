import Preact, {Component} from 'preact'
import {formToObj} from '../utils'
import Cookies from 'js-cookie'
import SetDocumentTitle from './SetDocumentTitle'

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
        if(r.authtoken){
          Cookies.set('authtoken', r.authtoken)
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
        <div>登入</div>
        <input name='username' type='text' autoComplete='username'
          maxLength='20' placeholder="username"
        />
        <input name='password' type='password' autoComplete='current-password'
          placeholder="password"
        />
        <button disabled={loading}>登入</button>
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
        <div>註冊新帳號</div>
        <input name='newUsername' type='text' maxLength='20' placeholder="username" />
        <input name='newPassword' type='password'
          autoComplete='off' placeholder="password"
        />
        <input name='verify-password' type='password'
          autoComplete='off' placeholder="verify password "
        />
        <button>註冊</button>
        {created && <span>Account is created succssfully.</span>}
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
      <section class='login-section'>
        <SetDocumentTitle title='登入 Krust' />
        <LoginForm />
        <hr />
        <SignupForm />
        <hr />
      </section>
    )
  }

}


export default Login
