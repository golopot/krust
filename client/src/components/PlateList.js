import Preact, {Component} from 'preact'
import PropTypes from 'prop-types'
import PlateForm from './PlateForm'
import Plink from './Plink'

class PlateItem extends Component{

  render(){
    const {plate} = this.props
    return(
      <div class='plate-item'>
        <div class='name'><Plink to={'/plate/'+plate.name}>{plate.name}</Plink></div>
        <div class='count'>{plate.userCount}</div>
      </div>
    )
  }
}

PlateItem.propTypes = {
  plate: PropTypes.string.isRequired,
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
      <div class='plate-list-page'>
        <div class='create-plate'>
          <span class='span-button' onClick={() => this.setState({creating: true})}>
						創造新板
          </span>
        </div>
        {this.state.creating && <PlateForm />}
        <div class='plate-list'>
          {this.state.plates
            ? this.state.plates.map( plate => <PlateItem plate={plate} key={plate.name} />)
            : <span>loading...</span>
          }

        </div>
      </div>
    )
  }
}
