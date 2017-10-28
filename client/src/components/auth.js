import {dq, formToObj, getStoryId} from '../utils'
import Preact from 'preact'
import Cookies from 'js-cookie'

if( dq('#login-form')){

  const elForm = dq('#login-form')
  var elLoader = Preact.render(<div />, elForm)
  var elErrorPopup = Preact.render(<span />, elForm)
  var button = elForm.querySelector('button')


  dq('#login-form').addEventListener('submit', ev => {
    ev.preventDefault()
    const form = new FormData(dq('#login-form'))

    button.disabled = true

    Preact.render(<div class='loader' />, null, elLoader)

    fetch('/api/login', {
      method: 'post',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(formToObj(form))
    })
      .then( r => r.json())
      .then( r => {
        if(r.data && r.data.authtoken){
          Cookies.set('authtoken', r.data.authtoken)
          console.log(r.data.authtoken)
          window.location = '/'
        }
        else{
          console.error(r)
          Preact.render(
            <span style='color:red;'>Incorrect username or password</span>,
            null,
            elErrorPopup
          )
          Preact.render(<div />, null, elLoader)
          button.disabled = false
        }
      })


  })
}

if( dq('#signup-form')){

  dq('#signup-form').addEventListener('submit', ev => {
    ev.preventDefault()
    const form = new FormData(dq('#signup-form'))
    fetch('/api/signup', {
      method: 'post',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(formToObj(form))
    })
  .then( r => r.json())
  .then( r => {
    if( r.ok === true ){
      window.location = window.location
    }
  })
  .catch(console.error)
  })
}



if( dq('button.logout') ){

  dq('button.logout').addEventListener('click', () => {
    Cookies.remove('authtoken', {path: '/'})
    window.location.href = '/'
  })
}


if( dq('.oauth-btn') ){

  window.oauthPopupCallback = function (hash){
    fetch('/api/signin-oauth',{
      method: 'post',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({hash}),
    })
      .then( r => r.json())
      .then( r => {
        document.cookie = `authtoken=${r.token};SameSite=Strict`
        // Max-Age=31536000
        window.location.href = '/'
      })
      .catch( e => console.error(e) )
  }

  dq('.oauth-btn').addEventListener('click', () => {

    var params = {
      client_id: '806708806553-ausj6asg5gof7tnfg2c20jjv32cm8jf6.apps.googleusercontent.com',
      redirect_uri: `http://${config.host}/oauth-redirect-back-google`,
      response_type: 'token',
      scope: 'https://www.googleapis.com/auth/userinfo.email',
      include_granted_scopes: 'true',
      state: 'ee=xxx&force=5',
    }

    var newWindow = window.open(
      'https://accounts.google.com/o/oauth2/v2/auth?'+qs.stringify(params),
      null,
      `width=525,height=725,left=${screenX+40},top=${screenY+40}`
    )

  })
}
