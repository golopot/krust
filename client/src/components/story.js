import {dq, formToObj, getStoryId} from '../utils'
import Preact from 'preact'
import {h} from 'preact'

const postForm = (ev, obj) => {
  ev.preventDefault()
  const form = new FormData(ev.target)
  const body = Object.assign(formToObj(form), obj)

  fetch('/api/edit-story', {
    method: 'post',
    credentials: 'include',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify(body),
  })
    .then( x => x.json() )
    .then( x => console.log(x))
    .then( () => window.location = window.location )
    .catch(console.error)

  ev.target.querySelector('button').disabled = true
}


if( dq('#create-post-form') ){

  dq('#create-post-form').addEventListener('submit', ev => {
    ev.preventDefault()
    const form = new FormData(dq('#create-post-form'))
    fetch('/api/create-post', {
      method: 'post',
      credentials: 'include',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(formToObj(form)),
    })
      .then( x => x.json() )
      .then( x => {
        if(x.ok === true){
          window.location = '/'
        }
        else{
          
        }

      })
      .catch(console.error)
  })
}


const EditorStory = ({story}) => (
  <form class='edit-story-form' onSubmit={ ev => postForm(ev, {story})}>
    <textarea name='content' />
    <div>
      <button>save</button>
    </div>
  </form>
)

if(dq('.story')){
  dq('.story > .byline > .upvote').addEventListener('click', () => {
    fetch('/api/vote', {
      method: 'post',
      credentials: 'include',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({
        direction: 1,
        target: getStoryId(),
        target_type: 'story',
      }),
    })
      .then( r => r.json())
      .then( r => console.log(r))
      .catch( e => console.error(e))
  })


  dq('.story > .byline .delete').addEventListener('click', () => {
    fetch('/api/delete-story', {
      method: 'post',
      credentials: 'include',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({
        id: getStoryId(),
      }),
    })
      .then( r => r.json())
      .then( r => console.log(r))
      .then( () => window.location = window.location )
      .catch( e => console.error(e))
  })


  dq('.story .edit').addEventListener('click', () => {

    Preact.render(
      <EditorStory story={getStoryId()} />,
      null,
      dq('.story .content')
    )


  })
}
