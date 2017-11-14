const mongoose = require('mongoose')
const M = require('./utils/Moi')
const StoryTag = require('./StoryTag')


const schema = new mongoose.Schema(M.translate({
	cname: M.string().required(),
  name: M.string().required(),
  plate: M.string().required(),
  count: M.number().required(),

}), { timestamps: true })

schema.statics.countTag = function(ctag){
	return StoryTag.collection.count({ctag})
	.then( count => {

		const [plate, name] = ctag.split('|')
		return Tag.collection.updateOne(
			{cname: ctag},
			{$set: {count, plate, name}},
			{upsert: true}
		)
	})
}

const Tag = mongoose.model('Tag', schema)

Tag.collection.createIndex({cname: 1}, {unique: 1})
Tag.collection.createIndex({count: 1})
Tag.collection.createIndex({plate: 1})


module.exports = Tag
