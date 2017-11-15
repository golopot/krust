const mongoose = require('mongoose')
const M = require('./utils/Moi')


const schema = new mongoose.Schema(M.translate({
	ctag: M.string().required(),
	story: M.number().required(),
}), { timestamps: true })

const CompositeTag = (plate, tag) => `${plate}|${tag}`


schema.statics.refreshTagsForStory = function(storyId){
	let story
	let tagsToRefresh
	return Story.findOne({id: storyId}, {id: 1, plate:1, tags: 1, deleted: 1})
		.then( doc => {
			if(doc === null) throw new Error('Story is not found')
			story = doc
			return StoryTag.collection.find({story: storyId}).toArray()
		})
		.then( docs => {
			const oldTags = docs.map( x => x.ctag )
			const newTags = story.tags.map( tag => CompositeTag(story.plate, tag))
			tagsToRefresh = Array.from(new Set([...oldTags, ...newTags]))
			return StoryTag.collection.remove({story: storyId})
		})
		.then( () => {
			if(story.deleted) return
			const ps = story.tags.map( tag =>
				new StoryTag({
					ctag: CompositeTag(story.plate, tag),
					story: storyId,
				})
				.save()
			)
			return Promise.all(ps)
		})
		.then( () => {
			const ps = tagsToRefresh.map( ctag => Tag.countTag(ctag) )
			return Promise.all(ps)
		})
}

const StoryTag = mongoose.model('StoryTag', schema)
StoryTag.collection.createIndex({ctag: 1})
StoryTag.collection.createIndex({story: 1})

module.exports = StoryTag
const Tag = require('./Tag')
const Story = require('./Story')
