import Preact, {Component} from 'preact'
import {Link} from 'react-router-dom'
import store from '../store'

import {formToObj} from '../utils'
import Comment from './Comment'
import CommentForm from './CommentForm'
import {Tag} from './Tag'

const onClickDelete = (ev) => {
  const storyId = ev.target.dataset.storyId
  fetch('/api/delete-story', {
    method: 'post',
    credentials: 'include',
    headers: {'content-type': 'application/json', 'X-CSRF-Prevention': 1},
    body: JSON.stringify({
      id: storyId,
    }),
  })
    .then( r => r.json())
    .then( r => console.log(r))
    .then( () => window.location = window.location )
    .catch( e => console.error(e))
}

const onSubmitEdit = (ev) => {
  ev.preventDefault()
  const storyId = ev.target.dataset.storyId
  const form = formToObj(new FormData(ev.target))
  const body = Object.assign(form, {
    storyId,
  })

  fetch('/api/edit-story', {
    method: 'post',
    credentials: 'include',
    headers: {'content-type': 'application/json', 'X-CSRF-Prevention': 1},
    body: JSON.stringify(body),
  })
    .then( r => r.json())
    .then( r => console.log(r))
  // .then( () => window.location = window.location )
    .catch( e => console.error(e))

}

const EditStoryForm = ({story}) => (
  <form className='edit-story-form' onSubmit={onSubmitEdit} data-story-id={story.id}>
    <textarea name='content' />
    <div>
      <button>save</button>
    </div>
  </form>
)

const onClickUpvote = function(){

  const target = this.props.story.id

  fetch('/api/vote', {
    method: 'post',
    credentials: 'include',
    headers: {'content-type': 'application/json', 'X-CSRF-Prevention': 1},
    body: JSON.stringify({
      direction: 1,
      target,
      target_type: 'story',
    }),
  })
    .then( r => r.json())
    .then( r => console.log(r))
    .catch( e => console.error(e))

}


const onClickEdit = function(ev){
  this.setState({editing: true})
}

class StoryProper extends Component{

  constructor(props){
    super(props)
    this.onClickDelete = onClickDelete.bind(this)
    this.onClickUpvote = onClickUpvote.bind(this)
    this.onClickEdit = onClickEdit.bind(this)
  }


  render(){
    const {story: s} = this.props
    const editing = this.state.editing
    return (
      <section className='story'>
        <div className='title'>
          <div>{s.title}</div>
        </div>

        <div className='byline'>
          <span className='votes'>{s.votes} </span>
          <span className='author'>{s.username} </span>
          <span className='date'>{s.date_submit} </span>
          <span>| </span>
          <span className='actions'>
            <span className='upvote' onClick={this.onClickUpvote}>upvote </span>
            <span className='edit' onClick={this.onClickEdit}>edit </span>
            <span className='delete' onClick={this.onClickDelete} data-story-id={s.id}>delete </span>
            <span>downvote </span>
            <span>flag </span>
          </span>
        </div>
        <div class='tagline'>
          {s.tags.map( x => <Tag tag={x} plate={s.plate} /> )}
        </div>

        { editing && <EditStoryForm story={s}/>}
        { s.deleted
          ? <div class='content'>[deleted]</div>
          : <div class='content' dangerouslySetInnerHTML={({__html: s.content_marked})} />
        }
      </section>
    )


  }
}


const Story = ({story}) => (
  <div>
    <StoryProper story={story} />
    <CommentForm storyId={story.id} commentId={null}/>
    <section id='comment-section'>
      {(story.comments||[]).map( c =>
        <Comment storyId={story.id} comment={c}  key={c.id} />
      )}

      {!story.comments &&
        <div>No comments yet.</div>
      }
    </section>
  </div>
)



const withStory = (Wrapped) => class extends Preact.Component{
  render(){
    this.endpoint = '/api/story/'+ window.location.pathname.slice(3)
    const {story} = store.resources[this.endpoint]
    return <Wrapped story={story} />
  }
}


export default withStory(Story)
