import Preact from 'preact'
import {Link} from 'react-router-dom'
import store from '../store'
import dateStringify from '../dateStringify'

const urlFromId = (id) => (
  '/p/' + id
)

const StoryItem = ({story}) => (
  <div className='story-item'>
    <div className='up'>
      <a className='title' href={urlFromId(story.id)}>{story.title}</a>
    </div>
    <div className='middle'>
      <span className='votes'>{story.votes} points </span>
      <span className='date-submit'>{dateStringify(story.date_submit)} </span>
      <span className='authors'>{story.username} </span>
    </div>
  </div>
)

const StoryList = ({stories, nextPage}) => (
  <div className='story-list'>
    { stories.map( story => <StoryItem story={story}/>) }
    { stories === null && <span>There is no story here.</span> }
    <div className='page-nav'>
      { nextPage ?
        <a href={`/?after=${nextPage}`} className='next'>next</a>
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
