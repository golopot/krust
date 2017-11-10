const Comment = require('../models/Comment')
const Story = require('../models/Story')
const Vote = require('../models/Vote')

const castVote = (req, res, next) => {
  const b = req.body
  const vote = new Vote({
    username: req.username,
    direction: b.direction,
    target: b.target,
    target_type: b.target_type,
    date: new Date(),
  })

  Promise.resolve().then( () => {
    var model
    if( b.target_type === 'comment')
      model = Comment
    if( b.target_type === 'story')
      model = Story

    return model.collection.findOne({id: vote.target})
  })
    .then( doc => {
      if( doc === null ){
        return Promise.reject('Comment or story is not found.')
      }
    })
    .then( () => {

      return Vote.findOne(
        {$and: [
          {username: vote.username},
          {target: vote.target},
          {target_type: vote.target_type},
        ]}
      )
    })
    .then( doc => {
      if(doc === null){
        return vote.save()
      }
      else{
        if(doc.direction != vote.direction){
          return Vote.collection.updateOne(
            {_id: doc._id},
            {$set: {direction: vote.direction}}
          )
        }
      }
    })
    .then( () => {
      return Vote.updateVoteCounts(vote.target, vote.target_type)
    })
    .then( r => {
      res.json({
        direction: vote.direction,
        votes: r.votes,
      })
    })
    .catch(next)
}

const getUserVotes = (req, res, next) => {
  Vote.collection.find({username: req.username}, {
    direction: 1,
    target: 1,
    target_type: 1,
  })
  .toArray()
  .then( docs => {
    res.json({userVotes: docs, username: req.username})
  })
  .catch(next)
}

module.exports = {
  castVote,
  getUserVotes,
}
