const mongoose = require('mongoose')
const M = require('./utils/Moi')
const fancyInsert = require('./utils/fancyInsert')
const Comment = require('./Comment')
const Story = require('./Story')


const schema = new mongoose.Schema(M.translate({
  username: M.string().required(),
  direction: M.number().required(),
  target: M.number().required(),
  target_type: M.string().required(),
  date: M.date(),
}))

schema.statics.fancyInsert = fancyInsert


schema.statics.updateVoteCounts = function(target, target_type){

  let total

  return this.collection.aggregate([
    {$match: {target}},
    {$group: {_id: target, total: {$sum: '$direction'}}}
  ])
    .toArray()
    .then( x => {
      const model =
      target_type === 'comment' && Comment ||
      target_type === 'story' && Story

      total = x[0].total
      return model.collection.updateOne({id: target}, {$set: {votes: x[0].total }})
    })
    .then( () => ({votes: total}) )
}

schema.statics.upvote = () => {

}

const Vote = mongoose.model('Vote', schema)


Vote.collection.createIndex({target: 1})
Vote.collection.createIndex({username: 1})

module.exports = Vote
