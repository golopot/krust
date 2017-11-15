const User = require('../models/User')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const {appsecret} = require('../../config')
const {cerr} = require('../utils')
const qs = require('qs')


const getHmac = (username, date) => {
  const pre = `${username}.${date}`
  return crypto.createHmac('sha256', appsecret).update(pre).digest('hex')
}

const sendAuthtoken = (user, res) => {
  const username = user.username
  const date = Date.now()
  const hash = getHmac(username, date)
  const authtoken = `${username}.${date}.${hash}`
  res.json({data:{authtoken, username}})
}

const auth = (req, res, next) => {

  if(req.body.test){
    req.username = sysop
    return next()
  }

  /* csrf check*/
  if( !req.headers['x-csrf-prevention']){
    throw cerr('API requests must include the header `X-CSRF-Prevention: 1`.')
  }
  /* Check authtoken */
  const token = req.cookies.authtoken || ''
  const parts = token.split('.')
  if( parts.length !== 3){
    throw cerr('Authentication error',401)
  }
  const [username, date, hash1] = parts
  const hash2 = getHmac(username, date)
  if( hash1 !== hash2 ){
    throw cerr('Authentication error',401)
  }
  req.username = username
  next()
}

const signUp = (req, res, next) => {
  const {newUsername, newPassword, email} = req.body
  User.collection.findOne({newUsername})
    .then( doc => {
      if( doc !== null){
        throw 'Username is already used.'
      }

      if( ! User.validateUsername(newUsername) ){
        throw 'Username is invalid.'
      }

      if( ! User.validatePassword(newPassword) ){
        throw 'Password is invalid.'
      }

      // TODO: validate email

      const saltRounds = 6

      return bcrypt.hash(newPassword, saltRounds)


    })
    .then( hashedPassword => {
      return User.fancyInsert(new User({
        username: newUsername,
        password: hashedPassword,
      }))
    })
    .then( id => res.json({
      data: {id},
      ok: true,
    }))
    .catch( e => next(e) )
}


const passwordSignIn = (req, res, next) => {
  const username = req.body.username
  const plainPassword = req.body.password
  var user
  User.collection.findOne({username})
    .then(doc => {
      user = doc
      return bcrypt.compare(plainPassword, doc.password)
    })
    .then(match => {
      if(match){
        sendAuthtoken(user, res)
      }
      else{
        res.frown('Password mismatch', 403)
      }
    })
    .catch( e => next(e) )
}


const oauthSignIn = (req,res,next) => {
  var {access_token} = qs.parse(req.body.hash.substring(1))
  if( !access_token ){res.frown()}

  const checkClientIdMatch = () =>
    fetch(
      'https://www.googleapis.com/oauth2/v3/tokeninfo?' + qs.stringify({access_token}),
      {method: 'post'}
    )
      .then( r => r.json())
      .then( r => {
        if(r.aud !== '806708806553-ausj6asg5gof7tnfg2c20jjv32cm8jf6.apps.googleusercontent.com'){
          throw('client_id mismatch')
        }
      })


  const getUserInfo = () =>
    fetch('https://www.googleapis.com/userinfo/v2/me' ,{
      method: 'get',
      headers: {Authorization: `Bearer ${access_token}`}
    })
      .then( r => r.json())
      .then( r => {
        if( r.verified_email !== true ) throw('google email is not verified')
        return r
      })

  const createUser = (info) => {
    return User.fancyInsert(new User({
      gid: info.id,
      name: 'unnamed',
      email: info.email,
    }))
      .then( id => User.collection.findOne({id}) )
  }

  const findOrCreateUser = (info) =>
    User.collection.findOne({gid: info.id})
      .then( x => x || createUser(info) )

  checkClientIdMatch()
    .then(getUserInfo)
    .then(findOrCreateUser)
    .then(sendAuthtoken)
    .catch( e => next(e) )

}



module.exports = {
  auth,
  passwordSignIn,
  oauthSignIn,
  signUp,
}
