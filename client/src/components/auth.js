import {dq, formToObj, getStoryId} from '../utils'
import Preact from 'preact'
import Cookies from 'js-cookie'


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
