const config = require('../config')
const debug = require('debug')('up')
const mongoose = require('mongoose')
mongoose.connect(config.mongourl, { useMongoClient: true })
mongoose.Promise = global.Promise
const api = require('./api/api')
const express = require('express')
const app = express()
const nunjucks = require('nunjucks')
nunjucks.configure('views', {express: app})
const Story = require('./models/Story')
const User = require('./models/User')
const Comment = require('./models/Comment')
const cookieParser = require('cookie-parser')
const {auth} = require('./api/auth')
const {ClientError} = require('./utils')

const dateToStr = d => `${d.getUTCFullYear()}/${d.getUTCMonth()+1}/${d.getUTCDate()}`
app.use(cookieParser())
app.disable('x-powered-by')

app.use( (req,res,next) => {
  res.panic = function(error, status){
    console.error(error)
    error = error || ''
    status = status || 500
    res.status(status).render('error.njk', {error: 'server error', status})
  }
  res.frown = function(error, status){
    console.error(error)
    error = error || ''
    status = status || 400
    res.status(status).render('error.njk', {error, status})
  }
  next()
})


app.use('/js', express.static(__dirname + '/../dist/js'))
app.use('/css', express.static(__dirname + '/../dist/css'))

app.use('/api', api )

app.get('/debug', (req,res,next) => {
  res.sent = true
  res.send('ooo')
  next()
})

app.get('/test', (req,res) => {
  console.log('oooooooo')
  res.json('test')
})


app.get('/', (req, res) => {

  const after = ~~ req.query.after

  Story.collection.find({
    id: { $gt: after},
    deleted: { $eq: null},
  })
    .limit(21).toArray()
    .then( data => {
      for(let x of data){
        x.date_submit = x.date_submit.getTime()
        x.link = `/p/${x.id}`
        x.username = x.username
      }

      const nextPage = data.length > 20 && data[20].id
      res.render('index.njk', {storys: data, nextPage})

    })
    .catch( e => console.error(e) )
})


app.get('/p/:id', (req, res, next) => {



  const treeBuild = nodes => {
    let topNodes = []
    let hash = {}
    for(let node of nodes){
      node.children = []
      hash[node.id] = node
    }

    for(let node of nodes){
      if(node.parent === null){
        topNodes.push(node)
      }
      else{
        hash[node.parent].children.push(node)
      }
    }
    return topNodes
  }

  var story

  Story.collection.findOne({id: ~~req.params.id})
    .then( x => {
      if( x === null ) throw 404
      story = x
    })
    .then( () => Comment.collection.find({story: story.id}).toArray())
    .then( comments => {
      const x = story
      res.render('story.njk', {
        id: x.id,
        title: x.title,
        view_counts: 57,
        votes: x.votes,
        date_submit: dateToStr(x.date_submit),
        username: x.username,
        content: x.content,
        comments: treeBuild(comments),
        deleted: x.deleted,
      })
    })
    .catch( e => next(e) )
})


app.get('/submit', (req, res) => {
  res.render('submit.njk')
})

app.get('/profile', auth, (req, res) => {
  var username = ''
  try{username = req.cookies.authtoken.split('.')[0]}
  catch(e){}

  User.findOne({username})
    .then( user => {
      res.render('profile.njk', {
        username: user.username,
        email: user.email,
      })
    })
    .catch( e => res.frown('user not found.') )
})

app.get('/login', (req, res) => {
  res.render('login.njk')
})

app.get('/oauth-redirect-back-google', (req,res) => {
  res.send(`
		<html><script>
			window.opener.oauthPopupCallback(window.location.hash)
			window.close()
		</script></html>
	`)
})


app.use( (err,req,res,next) => {

  console.error( err )

  res.status(500).send('500')
})

app.use( (err,req,res,next) => {

  if(err.constructor === ClientError){
    res.frown(err.reason, err.status)
  }

  else if( err === 404 ){
    res.status(404).render('notfound.njk')
  }
  else{
    console.error( err )
    res.panic('Unexpected server error')
  }
})

app.use( (req,res,next) => {

  res.status(404).render('notfound.njk')
})

app.listen(9090, function () {
  console.log('Server listening on http://localhost:9090')
})
