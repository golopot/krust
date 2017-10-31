const mongoose = require('mongoose')
const M = require('./utils/Moi')

const schema = new mongoose.Schema(M.translate({
  name: M.string().required(),
  moderators: [M.string()],
  date_created: M.date().required(),
  date_deleted: M.date(),
  deleted: M.boolean().required(),
}))


const Plate = mongoose.model('Plate', schema)

Plate.collection.createIndex( {name: 1}, {unique: true})

module.exports = Plate
