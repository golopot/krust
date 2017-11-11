import Preact, {Component} from 'preact'
import {withRouter} from 'react-router-dom'
import {formToObj} from '../utils'
import {StoryListContainer} from './StoryList'
import Plink from './Plink'
import promisedNavigate from '../promisedNavigate'

class VoteFilter extends Component{
	onKeyDown(ev){
		const {match, history} = this.props
		ev.stopPropagation()
		if(ev.key !== 'Enter') return
		const score = ev.target.value
		const to = `/plate/${match.params.plate}?score=${score}`
		promisedNavigate(to, history)
	}

	render(){
		return (
			<span>
				<input
					class='filter-input'
					onKeyDown={this.onKeyDown.bind(this)}
					placeholder='filters'
				/>
			</span>
		)
	}
}

class SortBy extends Component{

	render(){
		const {plateName} = this.props
		return (
			<span class='filter-tabs'>
				<Plink to={`/plate/${plateName}`}>Newest</Plink>
				<Plink to={`/plate/${plateName}?t=week`}>Week</Plink>
				<Plink to={`/plate/${plateName}?t=month`}>Month</Plink>
				<Plink to={`/plate/${plateName}?score=${20}`}>Filter</Plink>
			</span>
		)
	}
}


class Plate extends Component{
	constructor(){
		super()
		this.onClickCreatePost = this.onClickCreatePost.bind(this)
	}

	onClickCreatePost(){

	}

	render(){
		const {history, match} = this.props
		const {plate} = this.props.match.params
		const query = this.props.location.search
		return (
			<section class='plate'>
				<div class='top-bar'>
					<SortBy plateName={plate} />
					<VoteFilter history={history} match={match}/>
					<Plink class='new-post' to={`/submit/${plate}`}>New Post</Plink>
				</div>
				<StoryListContainer plate={plate} query={query} />
			</section>
		)
	}
}


export default Plate
