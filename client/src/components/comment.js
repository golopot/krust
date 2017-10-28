import {dq, formToObj, getStoryId} from '../utils'
import Preact from 'preact'
import {h} from 'preact'


const postForm = (ev, obj) => {
  ev.preventDefault()
  const form = new FormData(ev.target)
  const body = Object.assign(formToObj(form), obj)

  fetch('/api/create-comment', {
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


const ReplyComment = ({cid, story}) => (
  <form class='comment-reply-form' onSubmit={ ev => postForm(ev, {cid, story}) }>
    <textarea name='content' />
    <div>
      <button>save</button>
    </div>
  </form>
)


const AddComment = ({story}) => (
  <form class='add-comment-form' onSubmit={ ev => postForm(ev, {story})}>
    <textarea name='content' />
    <div>
      <button>save</button>
    </div>
  </form>
)



if(dq('#create-comment-slot')){
  Preact.render(<AddComment story={getStoryId()}/>, dq('#create-comment-slot'))
}


if( dq('#comment-section')){
  dq('#comment-section').addEventListener('click', (ev) => {
    if(ev.target.classList.contains('reply')){
      const comment = ev.target.parentNode.parentNode
      if(comment.querySelector('.comment-reply-form'))
        return
      else{
        const slot = document.createElement('div')
        comment.appendChild(slot)
        Preact.render(
          <ReplyComment cid={comment.dataset.cid} story={getStoryId()} />,
          slot
        )
      }
    }

    if(ev.target.classList.contains('upvote')){
      const comment = ev.target.parentNode.parentNode
      fetch('/api/vote', {
        method: 'post',
        credentials: 'include',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({
          direction: 1,
          target: comment.dataset.cid,
          target_type: 'comment',
        }),
      })
        .then( r => r.json())
        .then( r => console.log(r))
        .catch( e => console.error(e))
    }

  })
}
