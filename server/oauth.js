const config = require('./config')
const qs = require('qs')
const fetch = require('node-fetch')
const assert = require('assert')
const {getAuthtoken} = require('./api/auth')
const User = require('./models/User')

const google = (req, res) => {
  const query = {
    client_id: config.oauth_id_google,
    redirect_uri: `${config.protocol}://${config.hostname}/oauth2callback`,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/plus.me',
    include_granted_scopes: 'true',
  }

  const base = 'https://accounts.google.com/o/oauth2/auth'

  res.redirect(base + '?' + qs.stringify(query))
}

const callback = (req, res, next) => {

  const authorization_code = req.query.code

  const getAccessToken = () => (
    fetch(
      'https://www.googleapis.com/oauth2/v4/token',
      { method: 'post',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: qs.stringify({
          code: authorization_code,
          client_id: config.oauth_id_google,
          client_secret: config.oauth_secret_google,
          redirect_uri: `${config.protocol}://${config.hostname}/oauth2callback`,
          grant_type: 'authorization_code'
        })
      }
    )
      .then( r => r.json() )
      .then( r => {
        assert(r.access_token)
        return r.access_token
      })
  )

  const fetchApi = (access_token) => (
    fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {headers: { Authorization: `Bearer ${access_token}`}}
    )
      .then( r => r.json())
  )

  const createUser = (info) => (
    User.fancyInsert(new User({
      google_id: info.id,
      username: 'Unset',
      email: info.email,
    }))
      .then( id => User.collection.findOne({id}) )
  )

  const findOrCreateUser = (info) => (
    User.collection.findOne({google_id: info.id})
      .then( x => x || createUser(info) )
  )

  const sendResponse = (user) => {
    res.cookie('authtoken', getAuthtoken(user))
    res.redirect('/')
  }

  Promise.resolve()
    .then(getAccessToken)
    .then(fetchApi)
    .then(findOrCreateUser)
    .then(sendResponse)
    .catch(next)
}

module.exports = {
  google,
  callback,
}
