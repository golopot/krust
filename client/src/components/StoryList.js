import Preact from 'preact'
import {Link} from 'react-router-dom'
import store from '../store'
import dateStringify from '../dateStringify'
import Plink from './Plink'
const urlFromId = (id) => (
  '/p/' + id
)
import {Tagline} from './Tag'

const StoryItem = ({story}) => (
  <div className='story-item'>
    <div className='up'>
      <Plink class='title' to={urlFromId(story.id)}>{story.title}</Plink>
      <Tagline tags={story.tags} plate={story.plate} />
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
      { nextPage
        ? <a href={`/?after=${nextPage}`} className='next'>next</a>
        : <span>end of list</span>
      }
    </div>
  </div>
)

const StoryListContainer = ({plate, query}) => {
  query = query || ''
  const path = `/api/plate/${plate}${query}`
  const {stories, nextPage} = store.resources[path]
  return <StoryList stories={stories} nextPage={nextPage} />
}

export {StoryListContainer, StoryList}
