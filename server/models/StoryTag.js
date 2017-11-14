const mongoose = require('mongoose')
const M = require('./utils/Moi')


const schema = new mongoose.Schema(M.translate({
	ctag: M.string().required(),
	story: M.number().required(),
}), { timestamps: true })

const Model = mongoose.model('StoryTag', schema)
Model.collection.createIndex({ctag: 1})
Model.collection.createIndex({story: 1})

module.exports = Model
