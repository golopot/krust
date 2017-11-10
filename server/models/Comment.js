const mongoose = require('mongoose')
const M = require('./utils/Moi')
const fancyInsert = require('./utils/fancyInsert')

const schema = new mongoose.Schema(M.translate({
  id: M.number().required(),
  username: M.string().required(),
  story: M.number().required(),
  content: M.string().required(),
  content_marked: M.string().required(),
  votes: M.number(),
  parent: M.number(),
  date_submit: M.date().required(),
  date_edit: M.date(),
}), { timestamps: true })

schema.statics.fancyInsert = fancyInsert

const Comment = mongoose.model('Comment', schema)

Comment.collection.createIndex( {id: 1}, {unique: true})

module.exports = Comment
