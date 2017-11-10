const mongoose = require('mongoose')
const M = require('./utils/Moi')
const fancyInsert = require('./utils/fancyInsert')

const schema = new mongoose.Schema(M.translate({
  id: M.number().required(),
  title: M.string().required(),
  username: M.string().required(),
  user_id: M.number().required(),
  plate: M.string().required(),
  tags: [M.number()],
  votes: M.number(),
  content: M.string().required(),
  content_marked: M.string().required(),
  comments: [M.number()],
  date_submit: M.date().required(),
  date_edit: M.date(),
  deleted: M.boolean().required(),
}), { timestamps: true })

schema.statics.fancyInsert = fancyInsert

const Story = mongoose.model('Story', schema)

Story.collection.createIndex( {id: 1}, {unique: true})

module.exports = Story
