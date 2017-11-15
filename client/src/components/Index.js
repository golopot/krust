import Preact, {Component} from 'preact'
import store from '../store'
import {StoryList} from './StoryList'
import Plink from './Plink'
import SetDocumentTitle from './SetDocumentTitle'
import {PlateSidebar} from './Plate'

export default class Index extends Component{

  render() {

    const {plates} = store.resources['/api/plate']
    const {stories} = store.resources['/api/front-page-stories']
    return (
      <div class='homepage'>
        <SetDocumentTitle title='Krust' />
        <PlateSidebar />
        <div class='plate'>
          <div><StoryList stories={stories} /></div>
        </div>
      </div>
    )
  }
}
