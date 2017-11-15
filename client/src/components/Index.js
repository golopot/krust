import Preact, {Component} from 'preact'
import store from '../store'
import {StoryList} from './StoryList'
import Plink from './Plink'
import SetDocumentTitle from './SetDocumentTitle'

export default class Index extends Component{

  render() {

    const {plates} = store.resources['/api/plate']
    const {stories} = store.resources['/api/front-page-stories']
    return (
      <div class='homepage'>
        <SetDocumentTitle title='Krust' />
        <div class='hot-plates'>
          <div>社群</div>
          <div class='list'>
            {plates.map(x =>
              <div class='item' key={x.name}>
                <Plink to={`/plate/${x.name}`}>{x.name}</Plink>
              </div>
            )}
          </div>
        </div>
        <div class='hot-stories'>
          <div>貼文</div>
          <div><StoryList stories={stories} /></div>
        </div>
      </div>
    )
  }
}
