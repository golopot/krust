import Preact, {Component} from 'preact'
import pageCache from '../pageCache'
import {StoryList} from './StoryList'
import SetDocumentTitle from './SetDocumentTitle'
import {PlateSidebar} from './Plate'

export default class Index extends Component{

  render() {

    const {stories} = pageCache.get('/api/front-page-stories')
    return (
      <main class='homepage'>
        <SetDocumentTitle title='Krust' />
        <PlateSidebar />
        <div class='plate'>
          <div><StoryList stories={stories} /></div>
        </div>
      </main>
    )
  }
}
