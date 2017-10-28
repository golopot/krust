const Comment = require('../models/Comment')

const createComment = (req, res, next) => {
  const b = req.body
  const comment = new Comment({
    content: b.content,
    story: b.story,
    parent: b.cid || null,
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
