const mongoose = require('mongoose')
const M = require('./utils/Moi')

const schema = new mongoose.Schema(M.translate({
  username: M.string().required(),
  plate: M.string().required(),
}))


const PlateSubscription = mongoose.model('PlateSubscription', schema)

PlateSubscription.collection.createIndex({username: 1})

module.exports = PlateSubscription
