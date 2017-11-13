import Preact, {Component} from 'preact'
import {withRouter} from 'react-router-dom'
import {formToObj} from '../utils'
import {StoryListContainer} from './StoryList'
import Plink from './Plink'
import promisedNavigate from '../promisedNavigate'
import {Tag} from './Tag'
import SetDocumentTitle from './SetDocumentTitle'

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
					placeholder='分數大於?'
				/>
			</span>
		)
	}
}

const VoteFilterWithRouter = withRouter(VoteFilter)

class Tabs extends Component{

	render(){
		const {plateName} = this.props
		return (
			<span class='filter-tabs'>
				<Plink to={`/plate/${plateName}`}>最新</Plink>
				<Plink to={`/plate/${plateName}?t=week`}>本周</Plink>
				<Plink to={`/plate/${plateName}?t=month`}>本月</Plink>
				<a onClick={()=>this.setState({filterInput: true})}>過濾</a>
				{ this.state.filterInput && <VoteFilterWithRouter />}
			</span>
		)
	}
}

class FilterDescription extends Component{

	render(){
		const {plate} = this.props
		const m = /tag=([\w_-]+)/.exec(this.props.location.search)
		const tag = m ? m[1] : null
		return(
			tag &&
			<div>
				<span>Tag: </span>
				<Tag tag={tag} plate={plate} />
			</div>
		)
	}
}

const FilterDescriptionWithRouter = withRouter(FilterDescription)

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
				<SetDocumentTitle title={plate} />
				<div class='top-bar'>
					<Tabs plateName={plate} />
					<Plink class='new-post' to={`/submit/${plate}`}>發文</Plink>
				</div>
				<FilterDescriptionWithRouter plate={plate}/>
				<StoryListContainer plate={plate} query={query} />
			</section>
		)
	}
}


export default Plate
