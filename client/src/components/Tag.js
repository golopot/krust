import Preact, {Component} from 'preact'
import Plink from './Plink'
import PropTypes from 'prop-types'

export class Tag extends Component{
  render(){
    const {tag, plate} = this.props
    return(
      <Plink class='tag' to={`/plate/${plate}?tag=${tag}`}>{tag}</Plink>
    )
  }
}

const insertSpaces = (elements) => {
  const result = [' ']
  for(let e of elements){
    result.push(e)
    result.push(' ')
  }
  return result
}

export function Tagline({tags, plate}){

  return(
    <span class='tagline'>
      {insertSpaces(tags.map( x => <Tag tag={x} plate={plate} key={x} />))}
    </span>
  )
}
Tag.propTypes = {
  tag: PropTypes.string.isRequired,
  plate: PropTypes.string.isRequired,
}

Tagline.propTypes = {
  tags: PropTypes.string,
  plate: PropTypes.string,
}
