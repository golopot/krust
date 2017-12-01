## functionality
* crawl and post popular posts on ptt, medium, and blogs
* oauth
* link post
* precache link on mouse hover
* expand menu change to click from hover
* TLS
* add service worker
* 404
* anonymous user and captcha
* spam moderation
* notification
* subscribe plate
* edit history
* plate settting: text only...
* search filter: flagged deleted user before
* chat
* customizable stylesheets for each plate
* reputation
* pagination
* moderation history
* tag input assist
* preview before submit
* access control for editing, deleting
* use exponential backoff in fancyInsert
* plate subscription
* favorite tags
* show number of posts under a tag
* A button to cancel tag, score filters
* dark theme
* move comment collapse to right
* use absolute date for posts
* swipe left to goback, or show boards
* feed
* should plate name support chinese?
* align texts to an imaginary grid
* crosspost
* uglify
* link onclick change color to signal loading
* Add to home screen

## functionality-completed
* keyboard navigation
* tags
* boards

## Index
* feed
* all
* plates

## bug fix
* click on bottom of short post would trigger navigate back
* story list cache is stale if you edit a story and go back to list
* appsecret in auth use production config

## later
* api response format
* tests
* use base62 for id
* zero tolerane to FOUC
* metrics of response time, requests counts
* proptypes
* Caching fetched resources
* cleaner comments
* Improve Moi by eliminate the need for tranlation

## check
* persistent connection

## questions
* ask how to write pretty implementation in api for optional query fields.
* express error handle middle-ware
* ask how to know the origin stack for an error throw by a db request promise
