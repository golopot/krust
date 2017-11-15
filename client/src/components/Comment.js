import Preact, {Component} from 'preact'
import CommentForm from './CommentForm'
import {getUsername} from '../utils'
import pt from 'prop-types'
import store from '../store'

class Comment extends Component{

  constructor(props){
    super(props)
    const {id, votes} = props.comment
    this.state = {
      voteDirection: store.userVotes.get('comment'+id) || 0,
      temporaryVote: 0,
      votes,
    }
    this.onClick = this.onClick.bind(this)
  }

  onClick(ev){
    const has = (name) => ev.target.classList.contains(name)

    if(has('reply')){
      this.setState({replying: !this.state.replying})
    }

    if(has('upvote')){
      const oldDirection = this.state.voteDirection
      const newDirection = oldDirection === 1 ? 0 : 1
      this.setState({
        voteDirection: newDirection,
        temporaryVote: newDirection - oldDirection,
      })

      fetch('/api/vote', {
        method: 'post',
        credentials: 'include',
        headers: {'content-type': 'application/json', 'X-CSRF-Prevention': 1},
        body: JSON.stringify({
          direction: newDirection,
          target: this.props.comment.id,
          target_type: 'comment',
        }),
      })
        .then( r => r.json())
        .then( r => {
          if(r.error){
            throw(r.error)
          }
          this.setState({
            votes: this.state.votes + this.state.temporaryVote,
            temporaryVote: 0,
          })
          store.userVotes.set('comment'+this.props.comment.id, this.state.voteDirection)

        })
        .catch( e => console.error(e))
    }

    if(has('delete')){
      fetch('/api/delete-comment', {
        method: 'post',
        credentials: 'include',
        headers: {'content-type': 'application/json', 'X-CSRF-Prevention': 1},
        body: JSON.stringify({id: this.props.comment.id}),
      })
        .then( r => r.json() )
        .then( r => {
          if(r.error) throw r.error
          window.location = window.location
        })
        .catch(console.error)
    }

    if(has('collapse')){

      const button = ev.target

      const tree = button.parentNode.parentNode.parentNode
      const content = button.parentNode.parentNode.querySelector('.content')
      const children = tree.querySelector('.children')

      content.hidden = ! content.hidden
      children.hidden = ! children.hidden

      button.innerHTML = content.hidden ? '[+]' : '[-]'
    }

  }

  render(){
    const {comment: c, storyId} = this.props
    const {temporaryVote, voteDirection, votes} = this.state
    const voteMap = {
      '-1': 'dislike',
      '0': 'unvoted',
      '1': 'like'
    }
    const voteclass = voteMap[voteDirection]

    const contentMarked =  c.deleted ? '<p>[deleted]</p>' : c.content_marked

    return(
      <div class='comment-tree'>
        <div class='comment' onClick={this.onClick} data-cid={c.id}>
          <div class='byline'>
            <span class={`vote ${voteclass}`}>{votes + temporaryVote} </span>
            <span class='username'>{c.username} </span>
            {
              getUsername() &&
              <span class='actions'>
                <a class={`upvote ${voteclass}`}>推</a>
                <a class='reply'>回</a>
                <a class='edit'>編</a>
                <a class='delete'>刪</a>
              </span>
            }
            <span class='collapse'>[-]</span>
          </div>
          <div
            class='content'
            dangerouslySetInnerHTML={ ({__html: contentMarked}) }>
          </div>
          {this.state.replying &&
            <CommentForm storyId={storyId} commentId={c.id} />
          }
        </div>
        <div class='children'>
          {c.children.map( d =>
            <Comment storyId={storyId} comment={d} key={d.id} />
          )}
        </div>
      </div>
    )}

}

Comment.propTypes = {
  comment: pt.object.isRequired,
  storyId: pt.number.isRequired,
}

export default Comment
