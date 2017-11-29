import Preact, {Component} from 'preact'
import pageCache from '../pageCache'
import {StoryList} from './StoryList'
import SetDocumentTitle from './SetDocumentTitle'

export default class Index extends Component{

  render() {

    const {stories} = pageCache.get('/api/front-page-stories')
    return (
      <main class='homepage plate-page'>
        <SetDocumentTitle title='Krust' />
        <section class='plate'>
          <StoryList stories={stories} />
        </section>
      </main>
    )
  }
}
