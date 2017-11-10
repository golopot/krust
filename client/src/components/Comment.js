import Preact from 'preact'
import {Component} from 'preact'
import {Link} from 'react-router-dom'

import CommentForm from './CommentForm'


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
    const has = (className) => ev.target.classList.contains(className)

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
    const voteClassName = voteMap[voteDirection]

    return(
      <div class='comment-tree'>
        <div class='comment' onClick={this.onClick} data-cid={c.id}>
          <div class='byline'>
            <span class={`vote ${voteClassName}`}>{votes + temporaryVote} </span>
            <span class='username'>{c.username} </span>
            <span class={`upvote ${voteClassName}`}>upvote </span>
            <span class='reply'>reply </span>
            <span class='edit'>edit </span>
            <span class='delete'>delete </span>
            <span class='collapse'>[-]</span>
          </div>
          <div
            class='content'
            dangerouslySetInnerHTML={ ({__html: c.content_marked}) }>
          </div>
          {this.state.replying &&
            <CommentForm storyId={storyId} commentId={c.id} />
          }
        </div>
        <div className='children'>
          {c.children.map( d =>
            <Comment storyId={storyId} comment={d} key={d.id} />
          )}
        </div>
      </div>
    )}

}


export default Comment
