import Preact from 'preact'
import {Component} from 'preact'
import {Link} from 'react-router-dom'

import CommentForm from './CommentForm'


class Comment extends Component{

  constructor(props){
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  onClick(ev){
    const has = (className) => ev.target.classList.contains(className)

    if(has('reply')){
      this.setState({replying: !this.state.replying})
    }

    if(has('upvote')){
      fetch('/api/vote', {
        method: 'post',
        credentials: 'include',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({
          direction: 1,
          target: this.props.comment.id,
          target_type: 'comment',
        }),
      })
        .then( r => r.json())
        .then( r => {
          console.log(r)
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
    return(
      <div className='comment-tree'>
        <div className='comment' onClick={this.onClick} data-cid={c.id}>
          <div className='byline'>
            <div>{c.votes}</div>
            <div>{c.username}</div>
            <div className='upvote'>upvote</div>
            <div className='reply'>reply</div>
            <div className='edit'>edit</div>
            <div className='delete'>delete</div>
            <div className='collapse'>[-]</div>
          </div>
          <div className='content'>
            {c.content}
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
