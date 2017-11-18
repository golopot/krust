import Preact, {Component} from 'preact'
import {formToObj} from '../utils'
import pJump from '../promisedNavigate'
import PropTypes from 'prop-types'

const status = {
  IDLE: 0,
  WAIT: 1,
}

class StoryForm extends Component{
  constructor(props){
    super(props)
    this.setState( {status: status.IDLE} )
    this.onSubmit = this.onSubmit.bind(this)
  }

  fetchCreateStory(body){
    return fetch('/api/create-story', {
      method: 'post',
      credentials: 'include',
      headers: {'content-type': 'application/json', 'X-CSRF-Prevention': 1},
      body: JSON.stringify(body),
    })
      .then( r => r.json() )
      .then( r => {
        if(r.error){
          this.setState({error: true})
        }
        else{
          pJump(`/p/${r.id}`)
        }
      })
      .catch( e => console.error(e) )
  }

  fetchEditStory(body){
    return fetch('/api/edit-story', {
      method: 'post',
      credentials: 'include',
      headers: {'content-type': 'application/json', 'X-CSRF-Prevention': 1},
      body: JSON.stringify(body),
    })
      .then( r => r.json() )
      .then( r => {
        if(r.error){
          this.setState({error: true})
        }
        else{
          return pJump('/hack', {replace: true}).then( () =>
            pJump(`/p/${r.id}`, {replace: true})
          )
        }
      })
      .catch( e => console.error(e) )
  }

  onSubmit(ev){
    const {storyId} = this.props
    ev.preventDefault()
    this.setState( {status: status.WAIT} )
    const taglineParse = (tagline) => {
      return tagline.split(' ').filter(s => s.length>0)
    }
    const form = formToObj(new FormData(ev.target))
    const body = {
      ...form,
      plate: this.props.plate,
      tags: taglineParse(form.tags),
      ... ({storyId})
    }

    if(this.props.mode === 'edit'){
      this.fetchEditStory(body)
    }else if(this.props.mode === 'create'){
      this.fetchCreateStory(body)
    }

  }

  render(){
    const {title, content, tags} = this.props
    const serializedTags = tags && tags.join(' ')
    return (
      <form id='story-form' onSubmit={this.onSubmit}>
        <div><input name='title' placeholder='Title' defaultValue={title||null}/></div>
        <div><textarea name='content' placeholder='Content' defaultValue={content||null}/></div>
        <div><input name='tags' placeholder='Tags' defaultValue={serializedTags||null}/></div>
        <button type='submit'>Submit</button>
        {this.state.error && <span>Error</span>}
      </form>
    )
  }
}

StoryForm.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
  storyId: PropTypes.string,
  plate: PropTypes.string,
  tags: PropTypes.array,
  mode: PropTypes.string,
}


export const CreateStoryForm = ({plate}) => (
  <StoryForm mode='create' plate={plate} />
)

CreateStoryForm.propTypes = {
  mode: PropTypes.string.isRequired,
  plate: PropTypes.string.isRequired,
}

export const EditStoryForm = (props) => (
  <StoryForm mode='edit' {...props} />
)

EditStoryForm.propTypes = {
  mode: PropTypes.string.isRequired,
  storyId: PropTypes.number.isRequired,
  content: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  tags: PropTypes.array.isRequired,
}

export const CreateStory = ({match}) => (
  <div>
    <div>發文 {match.params.plate}</div>
    <CreateStoryForm plate={match.params.plate} />
  </div>
)

CreateStory.propTypes = {
  match: PropTypes.object.isRequired,
}
