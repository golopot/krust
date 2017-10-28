const data = require('./sodata.json')
const host = 'http://localhost:9090'
const fetch = require('node-fetch')
const fs = require('fs')

const filename = 'redditMockData.json'

https://www.reddit.com/comments/78q101.json

function crawl(){
  var url = 'https://www.reddit.com/comments/78q101.json'

  fetch(url)
  .then( r => r.text() )
  .then( r => fs.writeFileSync(filename,r))
  .catch(console.error)
}

function translateComment(comments){
  comments[1].data.children
}

function populate(){

  const data = JSON.parse(fs.readFileSync(filename))

    for(let entry of data.items){
        var {title, tags} = entry
        var user = entry.owner.display_name
        var content = '--'
        fetch(host + '/api/submit-question', {
            method: 'post',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({
                title,
                content,
                tags,
                user,
            })
        })
        .then( x => console.log(x))
        .catch( e => console.log(e))
    }

}

function clean(){

}


populate()
