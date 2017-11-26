const mongoose = require('mongoose')
const M = require('./utils/Moi')
const fancyInsert = require('./utils/fancyInsert')

const schema = new mongoose.Schema(M.translate({
  id: M.number().required(),
  username: M.string().required(),
  password: M.string(),
  google_id: M.string(),
  name: M.string(),
  email: M.string(),
  date_created: M.date(),
}))

schema.statics.fancyInsert = fancyInsert

schema.statics.validateUsername = (username) => {
  return /^.{2,20}$/.test(username)
 && /^[\w-]*$/.test(username)
}

schema.statics.validatePassword = (password) => {
  return /^.{8,}$/.test(password)
 && /[a-zA-Z]/.test(password)
 && /[0-9]/.test(password)
}

const User = mongoose.model('User', schema)

User.collection.createIndex( {id: 1}, {unique: true})
User.collection.createIndex( {username: 1}, {unique: true})
User.collection.createIndex( {google_id: 1})

module.exports = User
