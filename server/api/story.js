const Story = require('../models/Story')
const User = require('../models/User')
const Comment = require('../models/Comment')
const {dateToStr} = require('../utils')
const showdown = require('showdown')
const converter = new showdown.Converter({
  tables: true,
  strikethrough: true,
  simpleLineBreaks: true,
})
const xss = require('xss')


const createStory = (req, res, next) => {

  const b = req.body
  const story = new Story({
    title: b.title,
    content: b.content,
    content_marked: xss(converter.makeHtml(b.content)),
    plate: b.plate,
    votes: 0,
    username: req.username,
    tags: b.tags,
    deleted: false,
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
  Story.collection.updateOne({id: ~~b.storyId}, {$set:
    { title: b.title,
      content: b.content,
      content_marked: xss(converter.makeHtml(b.content)),
      tags: b.tags,
    }
  })
    .then( doc => {
      if( doc.matchedCount === 0 ) throw 'Story is not found.'
      res.json({id: ~~b.storyId})
    })
    .catch(next)
}



const getStories = (req, res, next) => {
  throw new Error('This is not implemented.')
}

const getFrontPageStories = (req, res, next) => {
  Story.collection.find({deleted: false}, {
    date_submit: 1,
    id: 1,
    title: 1,
    votes: 1,
    tags: 1,
    plate: 1,
    username: 1,
  })
  .sort({date_submit: -1})
  .toArray()
  .then( docs => {
    res.json({stories: docs})
  })
  .catch(next)
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


  Story.collection.findOne({id: ~~req.params.id})
    .then( story => {
      if( story === null ) throw 'Story not found.'
      return Comment.collection.find({story: story.id}).toArray()
        .then( comments => {
          const x = story
          res.json({story: {
            id: x.id,
            title: x.title,
            view_counts: 57,
            votes: x.votes,
            date_submit: dateToStr(x.date_submit),
            username: x.username,
            content: x.content,
            content_marked: x.content_marked,
            tags: x.tags,
            comments: treeBuild(comments),
            deleted: x.deleted,
            plate: x.plate,
          }})
        })
    })
    .catch(next)
}

const deleteStory = (req, res, next) => {
  const b = req.body
  Story.collection.updateOne({id: ~~b.id}, {$set:{deleted: true}} )
    .then( doc => {
      if(doc.matchedCount === 0) throw 'Story is not found.'
      res.json(doc)
    })
    .catch(next)
}

module.exports = {
  createStory,
  getStory,
  getStories,
  editStory,
  deleteStory,
  getFrontPageStories,
}
