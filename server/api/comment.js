const Comment = require('../models/Comment')
const Story = require('../models/Story')
const showdown = require('showdown')
const converter = new showdown.Converter({
  tables: true,
  strikethrough: true,
  simpleLineBreaks: true,
})
const xss = require('xss')

const createComment = (req, res, next) => {
  const b = req.body
  const comment = new Comment({
    content: b.content,
    content_marked: xss(converter.makeHtml(b.content)),
    story: b.storyId,
    parent: b.commentId || null,
    username: req.username,
    date_submit: new Date(),
    votes: 0,
  })

  // check story exist
  // check comment parent exist
  var commentId
  Comment.fancyInsert(comment)
    .then( id => {
      commentId = id
      return Story.collection.updateOne({id: b.story}, {$addToSet: {comments: id}})
    })
    .then( () => res.json({commentId}) )
    .catch( e => next(e) )
}


module.exports = {
  createComment
}
