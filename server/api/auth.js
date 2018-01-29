const User = require('../models/User')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const {appsecret} = require('../../config')
const {cerr} = require('../utils')


const getHmac = (username, date) => {
  const pre = `${username}.${date}`
  return crypto.createHmac('sha256', appsecret).update(pre).digest('hex')
}

const getAuthtoken = (user) => {
  const username = user.username
  const date = Date.now()
  const hash = getHmac(username, date)
  const authtoken = `${username}.${date}.${hash}`
  return authtoken
}

const auth = (req, res, next) => {

  /* csrf check*/
  if ( !req.headers['x-csrf-prevention']) {
    throw cerr('API requests must include the header `X-CSRF-Prevention: 1`.')
  }
  /* Check authtoken */
  const token = req.cookies.authtoken || ''
  const parts = token.split('.')
  if ( parts.length !== 3) {
    throw cerr('Authentication error',401)
  }
  const [username, date, hash1] = parts
  const hash2 = getHmac(username, date)
  if ( hash1 !== hash2 ) {
    throw cerr('Authentication error',401)
  }
  req.username = username
  next()
}

const signUp = (req, res, next) => {
  const {newUsername, newPassword} = req.body
  User.collection.findOne({newUsername})
    .then( doc => {
      if ( doc !== null) {
        throw 'Username is already used.'
      }

      if ( ! User.validateUsername(newUsername) ) {
        throw 'Username is invalid.'
      }

      if ( ! User.validatePassword(newPassword) ) {
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
      if (match) {
        res.json({authtoken: getAuthtoken(user)})
      }
      else {
        res.frown('Password mismatch', 403)
      }
    })
    .catch( e => next(e) )
}

module.exports = {
  auth,
  passwordSignIn,
  getAuthtoken,
  signUp,
}
