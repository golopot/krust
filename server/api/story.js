const Story = require('../models/Story')
const User = require('../models/User')
const Comment = require('../models/Comment')
const {dateToStr} = require('../utils')

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

/*
  /api/story/:id
*/
const getStory = (req, res, next) => {

  const treeBuild = nodes => {
    let topNodes = []
    let hash = {}
    for(let node of nodes){
      node.children = []
      hash[node.id] = node
    }

    for(let node of nodes){
      if(node.parent === null){
        topNodes.push(node)
      }
      else{
        hash[node.parent].children.push(node)
      }
    }
    return topNodes
  }

  var story

  Story.collection.findOne({id: ~~req.params.id})
    .then( x => {
      if( x === null ) throw 'Story not found.'
      story = x
    })
    .then( () => Comment.collection.find({story: story.id}).toArray())
    .then( comments => {
      const x = story
      story = {
        id: x.id,
        title: x.title,
        view_counts: 57,
        votes: x.votes,
        date_submit: dateToStr(x.date_submit),
        username: x.username,
        content: x.content,
        comments: treeBuild(comments),
        deleted: x.deleted,
      }
      res.json({story})
    })
    .catch( e => next(e) )
}

const editStory = (req, res, next) => {

  // TODO: check user is author or moderator or admin
  // TODO: check content valid
  const b = req.body
  Story.collection.updateOne({id: ~~b.storyId}, {$set:{content: b.content}} )
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
  getStory,
  editStory,
  deleteStory,
}
