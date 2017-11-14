import Preact, {Component} from 'preact'
import PropTypes from 'prop-types'
import {Tag} from './Tag'

export default class PlateTags extends Component{

  componentDidMount(){
    console.log(this.props)
    fetch('/api/tags/'+this.props.match.params.plate)
      .then( r => r.json() )
      .then( r => {
        if(r.error) throw r.error

        this.setState({tags: r.tags})
      })
  }

  render(){
    const tags = this.state.tags || []
    return(
      <div class='plate-tags'>
        {tags.map(t =>
          <div class='item' key={t.name}>
            <Tag tag={t.name} plate={t.plate} /><span>{t.count}</span>
          </div>)
        }
      </div>
    )
  }
}


PlateTags.propTypes = {
  match: PropTypes.object.isRequired,
}
