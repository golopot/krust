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


module.exports = {
  createPlate,
	getPlates,
}
