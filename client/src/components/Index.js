import Preact, {Component} from 'preact'
import store from '../store'
import {StoryList} from './StoryList'

export default class Index extends Component{

	render() {

    const {plates} = store.resources['/api/plate']
    const {stories} = store.resources['/api/front-page-stories']
		return (
			<div class='homepage'>
				<div class='hot-plates'>
					<div>熱門社群</div>
					<div>{plates.map(x => <div>{x.name}</div>)}</div>
				</div>
				<div class='hot-stories'>
          <div>熱門貼文</div>
          <div><StoryList stories={stories} /></div>
        </div>
			</div>
		)
	}
}
