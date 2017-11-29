import Preact, {Component} from 'preact'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom'
import {StoryListContainer} from './StoryList'
import Plink from './Plink'
import promisedNavigate from '../promisedNavigate'
import {Tag} from './Tag'
import SetDocumentTitle from './SetDocumentTitle'
import pageCache from '../pageCache'

class VoteFilter extends Component{
  onKeyDown(ev){
    const {match} = this.props
    ev.stopPropagation()
    if(ev.key !== 'Enter') return
    const score = ev.target.value
    const to = `/plate/${match.params.plate}?score=${score}`
    promisedNavigate(to)
  }

  render(){
    return (
      <span>
        <input
          class='filter-input'
          onKeyDown={this.onKeyDown.bind(this)}
          placeholder='分數大於?'
        />
      </span>
    )
  }
}

VoteFilter.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
}

const VoteFilterWithRouter = withRouter(VoteFilter)

class Tabs extends Component{
  render(){
    const {plateName} = this.props
    return (
      <span class='filter-tabs'>
        <Plink to={`/plate/${plateName}`}>最新</Plink>
        <Plink to={`/plate/${plateName}?t=week`}>本周</Plink>
        <Plink to={`/plate/${plateName}?t=month`}>本月</Plink>
        <a onClick={()=>this.setState({filterInput: true})}>過濾</a>
        { this.state.filterInput && <VoteFilterWithRouter />}
      </span>
    )
  }
}

Tabs.propTypes = {
  plateName: PropTypes.string.isRequired,
}


class FilterDescription extends Component{

  render(){
    const {plate} = this.props
    const m = /tag=([\w_-]+)/.exec(this.props.location.search)
    const tag = m ? m[1] : null
    return(
      tag && (
        <div>
          <span>Tag: </span>
          <Tag tag={tag} plate={plate} />
        </div>
      )
    )
  }
}

FilterDescription.propTypes = {
  plate: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
}

const FilterDescriptionWithRouter = withRouter(FilterDescription)

export const PlateSidebar = () => {
  const plates = pageCache.get('/api/plate').plates
  return (
    <section class='plates-sidebar'>
      <div class='list'>
        {plates.map(x =>
          <div class='item' key={x.name}>
            <Plink to={`/plate/${x.name}`}>{x.name}</Plink>
          </div>
        )}
      </div>
    </section>
  )
}

class PlateInner extends Component{

  render(){
    const {plateName, query} = this.props
    return (
      <section class='plate'>
        <SetDocumentTitle title={plateName} />
        <div class='top-bar'>
          <Tabs plateName={plateName} />
          <span class='right'>
            <Plink to={`/plate/${plateName}/tags`}>標籤</Plink>
            <Plink to={`/plate/${plateName}/rules`}>規則</Plink>
            <Plink class='new-post' to={`/submit/${plateName}`}>發文</Plink>
          </span>
        </div>
        <FilterDescriptionWithRouter plate={plateName}/>
        <StoryListContainer plate={plateName} query={query} />
      </section>
    )
  }
}

PlateInner.propTypes = {
  plateName: PropTypes.string.isRequired,
  query: PropTypes.string.isRequired,
}

class Plate extends Component{

  render(){

    const {plate} = this.props.match.params
    const {query} = this.props.location
    return (
      <main class='plate-page'>
        <PlateSidebar />
        <PlateInner plateName={plate} query={query} />
      </main>
    )
  }
}

Plate.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

export default Plate
