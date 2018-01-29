const User = require('../models/User')

const getUserProfile = (req, res, next) => {
  User.collection.findOne({username: req.username})
    .then( doc => {
      if (doc === null)
        throw 'user not found'
      else {
        res.json(doc)
      }
    })
    .catch(next)
}

const getUser = (req, res, next) => {
  const {username} = this.params
  User.collection.findOne({username})
    .then( doc => {
      if (doc === null) throw 'user not found'
      else {
        res.json({
          username: doc.username,
          date_created: Number(doc.date_created),
          points: doc.points,
        })
      }
    })
}

module.exports = {
  getUserProfile,
  getUser,
}
