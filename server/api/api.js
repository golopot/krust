const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')

const User = require('../models/User')
const Story = require('../models/Story')
const Comment = require('../models/Comment')
const Vote = require('../models/Vote')

const {voteController} = require('./vote')
const {createStory, getStory, editStory, deleteStory} = require('./story')
const {createComment} = require('./comment')
const {getUserProfile} = require('./userProfile')

const debug = require('debug')('qa')
// const pnr = s => {debug(s); return s}
const fetch = require('node-fetch')

const {ClientError, cerr, dateToStr} = require('../utils')
const {
  auth,
  passwordSignIn,
  oauthSignIn,
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

router.get('/stories', (req, res, next) => {

  const q = req.query
  Story.collection.find({}, {
    date_submit: 1,
    id: 1,
    title: 1,
    votes:1,
    username: 1,
  })
  .limit(q.size|| 20)
  .toArray()
  .then( docs => {
    for(let x of docs){
      x.date_submit = x.date_submit.getTime()
    }
    const nextPage = docs.length > 20 && docs[20].id
    res.json({stories: docs, nextPage})
  })
  .catch(next)

})

router.get('/profile', auth, getUserProfile)

router.get('/story/:id', getStory)

router.post('/signup', signUp)
router.post('/login', passwordSignIn)

router.post('/create-comment', auth, createComment)
router.post('/create-story', auth, createStory)
router.post('/delete-story', auth, deleteStory)
router.post('/edit-story', auth, editStory)
router.post('/vote', auth, voteController)


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
