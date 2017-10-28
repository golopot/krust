const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')

const User = require('../models/User')
const Story = require('../models/Story')
const Comment = require('../models/Comment')
const Vote = require('../models/Vote')

const {voteController} = require('./vote')
const {createStory, editStory, deleteStory} = require('./story')
const {createComment} = require('./comment')


const debug = require('debug')('qa')
// const pnr = s => {debug(s); return s}
const fetch = require('node-fetch')

const {ClientError, cerr} = require('../utils')
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

router.get('/storys', (req,res) => {

  const q = req.query

  Story.collection.find(ko({
    submit_date: {$gt: q.after},
  }))
    .limit(q.size)
    .toArray()
  // .then( r => pnr(r) )
    .then( r => res.json(r) )
    .catch( e => console.error(e) )

})

router.post('/signup', signUp)
router.post('/login', passwordSignIn)
router.post('/signin-oauth', oauthSignIn)

router.post('/create-comment', auth, createComment)

router.post('/create-post', auth, createStory)


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
