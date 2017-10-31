import Preact from 'preact'
import {Component} from 'preact'
import PlateForm from './PlateForm'

class PlateItem extends Component{

	render(){
		const {plate} = this.props
		return(
			<div class='plate-item'>
				<div class='name'><a href={'/plate/'+plate.name}>{plate.name}</a></div>
				<div class='count'>{plate.userCount}</div>
			</div>
		)
	}
}


export default class PlateList extends Component{

	componentDidMount(){
		fetch('/api/plate')
		.then( r => r.json() )
		.then( r => {

			if(r.plates !== undefined){
				this.setState({plates: r.plates})
			}
			else{
				this.setState({errored: true})
			}

		})
		.catch(console.error)
	}

	render(){
		return (
			<div>
				<div>
					<button onClick={() => this.setState({creating: true})}>
						Create a new plate
					</button>
					{this.state.creating && <PlateForm />}
				</div>
				<div>
					{this.state.plates
						? this.state.plates.map( plate => <PlateItem plate={plate} />)
						: <span>loading...</span>
					}

				</div>
			</div>
		)
	}
}
