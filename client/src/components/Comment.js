import {Component} from 'preact'
import Preact from 'preact'
import {
	BrowserRouter as Router,
	Route,
	Link
} from 'react-router-dom'

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
			<div class='comment-tree'>
				<div class='comment' onClick={this.onClick} data-cid={c.id}>
					<div class='byline'>
						<div>{c.votes}</div>
						<div>{c.username}</div>
						<div class='upvote'>upvote</div>
						<div class='reply'>reply</div>
						<div class='edit'>edit</div>
						<div class='delete'>delete</div>
						<div class='collapse'>[-]</div>
					</div>
					<div class='content'>
						{c.content}
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


export default Comment
