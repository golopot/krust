const Tag = require('../models/Tag')


const getTags = (req, res, next) => {
	Tag.collection.find({plate: req.params.plate})
	.sort({count: -1})
	.toArray()
	.then( docs => res.json({tags: docs}))
	.catch(next)
}


module.exports = {
	getTags
}
