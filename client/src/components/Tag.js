import Preact, {Component} from 'preact'
import Plink from './Plink'
import PropTypes from 'prop-types';

export class Tag extends Component{
	render(){
		const {tag, plate} = this.props
		return(
			<Plink class='tag' to={`/plate/${plate}?tag=${tag}`}>{tag}</Plink>
		)
	}
}

export function Tagline({tags, plate}){

	return(
		<div class='tagline'>
			{tags.map( x => <Tag tag={x} plate={plate} />)}
		</div>
	)
}



Tagline.propTypes = {
	tags: PropTypes.string,
	plate: PropTypes.string,
}
