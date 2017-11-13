import Preact from 'preact'
import {Component} from 'preact'
import {Link} from 'react-router-dom'
import store from '../store'

import {formToObj} from '../utils'
import pJump from '../promisedNavigate'
import PropTypes from 'prop-types';


const Loading = () => <span>Loading...</span>

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
          pJump('/hack').then( () =>
            pJump(`/p/${r.id}`)
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
      return tagline.split(' ')
    }
    const form = formToObj(new FormData(ev.target))
    const body = {
      ...form,
      plate: this.props.plate,
      tags: taglineParse(form.tags),
      ... (storyId && {storyId})
    }

    if(this.props.mode === 'edit'){
      this.fetchEditStory(body)
    }else{
      this.fetchCreateStory(body)
    }

  }

  render(){
    const {title, content, tags} = this.props
    const serializedTags = tags.join(' ')
    return (
      <form id='story-form' onSubmit={this.onSubmit}>
        <div><input name='title' placeholder='Title' value={title||null}/></div>
        <div><textarea name='content' placeholder='Content' value={content||null}/></div>
        <div><input name='tags' placeholder='Tags' value={serializedTags||null}/></div>
        <button type='submit'>Submit</button>
        {this.state.error && <span>Error</span>}
      </form>
    )
  }
}




export const CreateStoryForm = ({plate}) => (
  <StoryForm plate={plate} mode='create' />
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

export const CreateStory = ({match, history}) => (
  <div>
    <div>Submit to {match.params.plate}</div>
    <CreateStoryForm plate={match.params.plate} />
  </div>
)
