import Preact, {Component} from 'preact'
import PropTypes from 'prop-types'

export default class DropDown extends Component {
  constructor(props) {
    super(props)
    const {children, initialSelected, summary} = this.props
    const selected = initialSelected || 0
    this.state.summary = summary || children[selected].children[0]
    this.state.open = false
    this.toggleOpen = this.toggleOpen.bind(this)
    this.onClickItem = this.onClickItem.bind(this)
  }
  toggleOpen() {
    this.setState({open: !this.state.open})
  }
  onClickItem(ev) {
    if (this.props.summary) return
    this.toggleOpen()
    this.setState({summary: ev.target.innerText})
  }
  render() {
    const open = this.state.open ? ' open' : ''
    return (
      <div class={'dropdown '+this.props.class||''}>
        <div class='summary' onClick={this.toggleOpen}>
          {this.state.summary}
        </div>
        <div class={'details'+open}>
          {this.props.children.map( child =>
            <div key={child.key}>
              {Preact.cloneElement(child, {onClick: this.onClickItem}) }
            </div>
          )}
        </div>
      </div>
    )
  }
}

DropDown.propTypes = {
  class: PropTypes.string,
  summary: PropTypes.string,
  initialSelected: PropTypes.number,
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
}
