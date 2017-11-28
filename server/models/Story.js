const mongoose = require('mongoose')
const M = require('./utils/Moi')
const fancyInsert = require('./utils/fancyInsert')

const schema = new mongoose.Schema(M.translate({
  id: M.number().required(),
  title: M.string().required(),
  username: M.string().required(),
  user_id: M.number().required(),
  plate: M.string().required(),
  votes: M.number(),
  content: M.string(),
  link: M.string().required(),
  content_marked: M.string(),
  comments: [M.number()],
  comments_count: M.number().required(),
  tags: [M.string()],
  date_submit: M.date().required(),
  date_edit: M.date(),
  deleted: M.boolean().required(),
}))

schema.statics.fancyInsert = fancyInsert

schema.statics.updateCommentsCount = (id) => (
  Comment.count({story: id})
    .then( count => {
      return Story.updateOne({id}, {$set: {comments_count: count}})
    })
)

const Story = mongoose.model('Story', schema)

Story.collection.createIndex( {id: 1}, {unique: true})

module.exports = Story

const Comment = require('./Comment')
