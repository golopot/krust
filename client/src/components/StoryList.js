import Preact from 'preact'
import pageCache from '../pageCache'
import PropTypes from 'prop-types'
import StoryItem from './StoryItem'

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
