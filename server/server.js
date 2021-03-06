const config = require('./config')
const mongoose = require('mongoose')
const api = require('./api/api')
const express = require('express')
const app = express()
const nunjucks = require('nunjucks')
nunjucks.configure('views', {express: app})
const Story = require('./models/Story')
const cookieParser = require('cookie-parser')
const compression = require('compression')
const oauth = require('./oauth')
const path = require('path')
const {ClientError} = require('./utils')

app.use(compression())
app.use(cookieParser())
app.disable('x-powered-by')

app.use( (req,res,next) => {
  res.panic = function(error, status) {
    console.error(error)
    error = error || ''
    status = status || 500
    res.status(status).render('error.njk', {error: 'server error', status})
  }
  res.frown = function(error, status) {
    console.error(error)
    error = error || ''
    status = status || 400
    res.status(status).render('error.njk', {error, status})
  }
  next()
})


app.use('/js', express.static(__dirname + '/../dist/js'))
app.use('/css', express.static(__dirname + '/../dist/css'))
app.use('/assets', express.static(__dirname + '/../assets'))
app.use('/', express.static(__dirname + '/../assets/index'))

app.use('/api', api )

app.get('/test', (req, res, next) => {
  res.send('ooo')
  next()
})


const sendEmptyBody = (req, res) => res.render('react.njk')

app.get('/', sendEmptyBody)
app.get('/plate/:plate', sendEmptyBody)
app.get('/plate/:plate/rules', sendEmptyBody)
app.get('/plate/:plate/tags', sendEmptyBody)

app.get('/p/:id', (req, res, next) => {

  Story.collection.findOne({id: ~~req.params.id})
    .then( x => {
      if ( x === null ) throw 404
      res.render('react.njk')
    })

    .catch( e => next(e) )
})


app.get('/submit/:plate', sendEmptyBody)
app.get('/profile', sendEmptyBody)
app.get('/login', sendEmptyBody)
app.get('/about', sendEmptyBody)
app.get('/plates', sendEmptyBody)
app.get('/u/:user', sendEmptyBody)
app.get('/oauth/google', oauth.google)
app.get('/oauth2callback', oauth.callback)
app.get('/sw.js', (req, res) => res.sendFile(path.resolve(__dirname + '/../client/sw.js')))


app.use( (err,req,res,next) => {

  if (err.constructor === ClientError) {
    res.frown(err.reason, err.status)
  }

  else if ( err === 404 ) {
    res.status(404).render('notfound.njk')
  }
  else {
    console.error( err )
    res.panic('Unexpected server error')
  }
})

app.use( (req,res,next) => {

  res.status(404).render('notfound.njk')
})

mongoose.connect(config.mongourl)
  .then( () => console.log('Mongodb connected. ' + config.mongourl) )
  .catch(console.error)

app.listen(config.port, function () {
  console.log('Server listening on http://localhost:' + config.port)
})
