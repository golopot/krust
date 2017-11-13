const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')

const Story = require('../models/Story')

const {castVote, getUserVotes} = require('./vote')
const {createStory, getStory, getStories, editStory, deleteStory,
  getFrontPageStories} = require('./story')
const {createPlate, getPlates, getPlate} = require('./plate')
const {createComment} = require('./comment')
const {getUserProfile, getUser} = require('./user')

const {ClientError, dateToStr} = require('../utils')
const {createSubscription, getSubscriptions, deleteSubscription}
  = require('./plateSubscription')

const {
  auth,
  passwordSignIn,
  signUp,
} = require('./auth')


const ko = obj => {
  for(var field in obj){
    for(var op in obj[field]){
      if(obj[field][op] === null){
        delete obj[field][op]
      }
    }
    if( Object.keys(obj[field]).length === 0 && obj.constructor === Object ){
      delete obj[field]
    }
  }
  return obj
}


router.use( bodyParser.json() )

router.use( (req, res, next) => {
  res.panic = function(error, status){
    console.error(error)
    error = 'Unexpected server error'
    status = status || 500
    res.status(status).json({error, status})
  }
  res.frown = function(error, status){
    console.error(error)
    error = error || 'Bad request'
    status = status || 400
    res.status(status).json({error, status})
  }
  next()
})

router.get('/', (req,res) => {
  res.json({foo: 'bar'})
})

router.get('/stories', getStories)
router.get('/front-page-stories', getFrontPageStories)
router.get('/plate', getPlates)

router.get('/user/:user', getUser)
router.get('/profile', auth, getUserProfile)
router.get('/user-votes', auth, getUserVotes)

router.get('/story/:id', getStory)
router.get('/plate/:name', getPlate)

router.post('/signup', signUp)
router.post('/login', passwordSignIn)

router.post('/create-comment', auth, createComment)
router.post('/create-story', auth, createStory)
router.post('/create-plate', auth, createPlate)
router.post('/delete-story', auth, deleteStory)
router.post('/edit-story', auth, editStory)
router.post('/vote', auth, castVote)

router.post('/delete-subscription', auth, deleteSubscription)
router.post('/create-subscription', auth, createSubscription)
router.get('/get-subscriptions', auth, getSubscriptions)


router.use( (err,req,res,next) => {


  if(err.constructor === ClientError){
    res.frown(err.reason, err.status)
  }
  else if( typeof err === 'string'){
    res.frown(err, 400)
  }
  else{
    //TODO error logging
    res.panic(err)
  }

})

router.use( (req, res) => {

  res.status(404).json({error: '404 Route is not found.'})
})

module.exports = router
