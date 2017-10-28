const Comment = require('../models/Comment')
const Story = require('../models/Story')
const Vote = require('../models/Vote')

const voteController = (req, res, next) => {
    const b = req.body
    let vote = new Vote({
      username: req.username,
      direction: b.direction,
      target: b.target,
      target_type: b.target_type,
      date: new Date(),
    })
    var target

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
          vote._id = doc._id
          return vote.save()
        }
      }
    })
    .then( r => {
      return Vote.updateVoteCounts(vote.target, vote.target_type)
    })
    .then( r => {
      res.json(r)
    })
    .catch(next)
}

module.exports = {
  voteController
}
