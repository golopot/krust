const Plate = require('../models/Plate')
const Story = require('../models/Story')

const getPlates = (req, res, next) => {
  Plate.collection.find({})
    .toArray()
    .then( docs => {
      res.json({
        plates: docs,
      })
    })
    .catch(next)
}

const createPlate = (req, res, next) => {
  const b = req.body

  const plate = new Plate({
    name: b.name,
    moderators: [req.username],
    date_created: new Date(),
    deleted: false,
  })

  plate.save()
    .then( x => {
      res.json({plate: x})
    })
    .catch(next)
}

const getPlate = (req, res, next) => {

  const {name} = req.params
  const q = req.query
  let sort
  let selector = {
    plate: name,
    deleted: false,
  }

  if(q.tag){
    selector['tags'] = q.tag
  }

  if(q.t === 'week' || q.t === 'month'){
    sort = {votes: -1}

    if(q.t ==='week'){
      Object.assign(selector, {date_submit: {$gt: new Date(new Date() - 86400*1000*7)} })
    }

    if(q.t === 'month'){
      Object.assign(selector, {date_submit: {$gt: new Date(new Date() - 86400*1000*30)}})
    }

  }
  else{
    sort = {date_submit: -1}

    if(Number(q.score) >= 0){
      Object.assign(selector, {votes: {$gte: Number(q.score) }})
    }

    if(q.before){
      Object.assign(selector, {date_submit: {$lt: q.before}})
    }
  }
  Story.collection.find(selector, {
    date_submit: 1,
    id: 1,
    title: 1,
    votes: 1,
    tags: 1,
    plate: 1,
    username: 1,
  })
    .limit(q.size|| 20)
    .sort(sort)
    .toArray()
    .then( docs => {
      for(let x of docs){
        x.date_submit = x.date_submit.getTime()
      }
      const nextPage = docs.length > 20 && docs[20].id
      res.json({
        stories: docs,
        nextPage,
        plateName: name,
      })
    })
    .catch(next)

}


module.exports = {
  createPlate,
  getPlates,
  getPlate,
}
