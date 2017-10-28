const Story = require('../models/Story')
const User = require('../models/User')

const createStory = (req, res, next) => {

  const b = req.body
  const story = new Story({
    title: b.title,
    content: b.content,
    plate: b.plate,
    votes: 0,
    username: req.username,
    deleted: null,
    date_submit: new Date(),
  })

  User.collection.findOne({username: req.username}, {id: 1})
    .then( doc => {
      if( doc === null) throw('user not found.')
      story.user_id = doc.id
    })
    .then( () => Story.fancyInsert(story) )
    .then( id => res.json({id, ok: true}))
    .catch( e => next(e) )

}

const editStory = (req, res, next) => {

  // TODO: check user is author or moderator or admin
  // TODO: check content valid
  const b = req.body
  Story.collection.updateOne({id: ~~b.story}, {$set:{content: b.content}} )
  .then( doc => {
    if( doc.matchedCount === 0 ) throw 'Story is not found.'
    res.json(doc)
  })
  .catch(next)
}

const deleteStory = (req, res, next) => {
  const b = req.body
  Story.collection.updateOne({id: ~~b.id}, {$set:{deleted: new Date()}} )
  .then( doc => {
    if(doc.matchedCount === 0) throw 'Story is not found.'
    res.json(doc)
  })
  .catch(next)
}

module.exports = {
	createStory,
  editStory,
  deleteStory,
}
