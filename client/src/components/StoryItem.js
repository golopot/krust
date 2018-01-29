import Preact from 'preact'
import PropTypes from 'prop-types'
import {Tagline} from './Tag'
import Plink from './Plink'
import dateStringify from '../dateStringify'
const urlFromId = (id) => '/p/' + id

const StoryItem = ({story, showPlate}) => (
  <div class='story-item'>
    <Plink class='glass' to={urlFromId(story.id)}></Plink>
    <div class='left score'>
      {story.votes}
    </div>
    <div class='right'>
      <span class='up'>
        <a class='title' href={story.link||urlFromId(story.id)}>{story.title}</a>{' '}
        { !story.link && '☶' }{' '}
        <LinkDomain link={story.link}/>{' '}
        <Tagline tags={story.tags} plate={story.plate} />
      </span>
      <div class='mobile-bottom'>
        <span class='counts'>
          <span class='count'>
            <i class="fa fa-heart-o" aria-hidden="true"></i>
            {story.votes}{' '}
          </span>
          <span class='count'>
            <i class="fa fa-commenting-o" aria-hidden="true"></i>
            {story.comments_count||0}
          </span>
        </span>
        <span class='byline'>
          <span class='date-submit'>{dateStringify(story.date_submit)}</span>
          <span class='author'>{' ⋅ '}{story.username}</span>
          <span class='plate' style={{display: showPlate ? 'inline': 'none'}}>
            {' ⋅ '}
            <Plink to={`/plate/${story.plate}`}>{story.plate}</Plink>
          </span>
          <span class='comments'>
            {' ⋅ '}
            <Plink to={urlFromId(story.id)}>{story.comments_count||0} comments</Plink>
          </span>
        </span>
      </div>
    </div>
  </div>
)

StoryItem.propTypes = {
  story: PropTypes.object.isRequired,
  showPlate: PropTypes.boolean,
}

const LinkDomain = ({link}) =>{
  if (link) {
    try {
      const hostname = new URL(link).hostname.replace(/^www\./, '')
      return <span class='link' href={link}>{hostname}</span>
    }
    catch (e) {
      e.message += ' input=' + JSON.stringify(link)
      console.error(e)
      return null
    }
  }
  else {
    return <span class='link'></span>
  }
}

LinkDomain.propTypes = {
  link: PropTypes.string,
}

export default StoryItem
