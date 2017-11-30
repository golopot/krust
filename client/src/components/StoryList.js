import Preact from 'preact'
import pageCache from '../pageCache'
import dateStringify from '../dateStringify'
import Plink from './Plink'
const urlFromId = (id) => (
  '/p/' + id
)
import {Tagline} from './Tag'
import PropTypes from 'prop-types'


const StoryLink = ({link}) =>{
  if(link){
    try{
      const hostname = new URL(link).hostname.replace(/^www\./, '') + '...'
      return <a class='link' href={link}>{hostname}</a>
    }
    catch(e){
      e.message += ' input=' + JSON.stringify(link)
      console.error(e)
      return null
    }
  }
  else{
    return <span class='link'></span>
  }
}

StoryLink.propTypes = {
  link: PropTypes.string,
}

const StoryItem = ({story, showPlate}) => (
  <div class='story-item'>
    <div class='left score'>
      {story.votes}
    </div>
    <div class='right'>
      <div class='up'>
        <Plink class='title' to={urlFromId(story.id)}>{story.title}</Plink>
        <StoryLink link={story.link}/>
        <Tagline tags={story.tags} plate={story.plate} />
      </div>
      <div class='bottom'>
        <span class='date-submit'>{dateStringify(story.date_submit)} </span>
        <span class='authors'>{story.username} </span>
        <span class='comments'>{story.comments_count|| 0}cs </span>
        {showPlate && <Plink class='plate'to={`/plate/${story.plate}`}>{story.plate}</Plink> } {' '}
      </div>
    </div>
  </div>
)

StoryItem.propTypes = {
  story: PropTypes.object.isRequired,
  showPlate: PropTypes.boolean,
}

const StoryList = ({stories, nextPage, showPlate = false}) => (
  <div class='story-list'>
    { stories.map( story => <StoryItem story={story} key={story.id} showPlate={showPlate} />) }
    { stories && stories.length === 0 && <div>There is no story here.</div> }
    <div class='page-nav'>
      { nextPage
        ? <a href={`/?after=${nextPage}`} class='next'>next</a>
        : <span></span>
      }
    </div>
  </div>
)

StoryList.propTypes = {
  stories: PropTypes.object.isRequired,
  nextPage: PropTypes.number,
  showPlate: PropTypes.boolean,
}

const StoryListContainer = ({plate, query}) => {
  query = query || ''
  const path = `/api/plate/${plate}${query}`
  const {stories, nextPage} = pageCache.get(path)
  return <StoryList stories={stories} nextPage={nextPage} />
}

StoryListContainer.propTypes = {
  plate: PropTypes.string.isRequired,
  query: PropTypes.string,
}

export {StoryListContainer, StoryList}
