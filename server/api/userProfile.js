const User = require('../models/User')

const getUserProfile = (req, res, next) => {
	User.collection.findOne({username: req.username})
	.then( doc => {
		if(doc === null)
			throw 'user not found'
		else{
			res.json(doc)
		}
	})
	.catch(next)
}

module.exports = {
	getUserProfile,
}
