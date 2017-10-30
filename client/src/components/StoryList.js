import Preact from 'preact'
import {
	BrowserRouter as Router,
	Route,
	Link
} from 'react-router-dom'

import store from '../store'

import dateStringify from '../dateStringify'

const urlFromId = (id) => (
	'/p/' + id
)

const StoryItem = ({story}) => (
	<div class='story-item'>
		<div class='up'>
			<a class='title' href={urlFromId(story.id)}>{story.title}</a>
		</div>
		<div class='middle'>
			<span class='votes'>{story.votes} points </span>
			<span class='date-submit'>{dateStringify(story.date_submit)} </span>
			<span class='authors'>{story.username} </span>
		</div>
	</div>
)

const StoryList = ({stories, nextPage}) => (
	<div class='story-list'>
		{ stories.map( story => <StoryItem story={story}/>) }
		{ stories === null && <span>There is no story here.</span> }
		<div class='page-nav'>
			{ nextPage ?
					<a href={`/?after=${nextPage}`} class='next'>next</a>
					: <span>end of list</span>
			}
		</div>
	</div>
)

const Container = (Wrapped) => () => {
	const {stories, nextPage} = store.resources['/api/stories']
	return <Wrapped stories={stories} nextPage={nextPage}/>
}

const resources = [
	'/api/stories'
]

export default Container(StoryList)
