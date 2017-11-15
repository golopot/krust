const PlateSubscription = require('../models/PlateSubscription')


const createSubscription = (req, res, next) => {
  const b = req.body
  const s = new PlateSubscription({
    username: req.username,
    plate: b.plate,
  })

  s.save()
    .then( r => res.json(r))
    .catch(next)

}

const getSubscriptions = (req, res, next) => {
  PlateSubscription.collection.find({
    username: req.username,
  })
    .toArray()
    .then( docs => {
      res.json(docs)
    })
    .catch(next)

}


const deleteSubscription = (req, res, next) => {
  PlateSubscription.collection.deleteOne({
    username: req.username,
    plate: req.body.plate,
  })
    .then( r => res.json(r) )
    .catch(next)
}


module.exports = {
  createSubscription,
  getSubscriptions,
  deleteSubscription,
}
