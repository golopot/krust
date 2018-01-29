import store from './store'

const scrollAmount = 50
const pageIsPost = () => {
  return /^\/p\//.test(location.pathname)
}

class KeyboardNavigator{
  constructor(){
    this.cursor = null
    this.hookListeners()
  }

  hookListeners(){
    window.addEventListener('keydown', this.onKeydown.bind(this))
  }

  back(){
    store.history.goBack()
  }

  onKeydown(ev){
    if(ev.target !== document.body) return
    const key = ev.key
    if(ev.ctrlKey || ev.altKey){
      return
    }

    if(key == 'ArrowUp'){
      if(pageIsPost()){
        ev.preventDefault()
        window.scrollBy(0, -scrollAmount)
        return
      }

      if(this.cursor === null){
        this.cursor = 0
      }
      else if(this.cursor === 0){
        this.cursor = 0
      }
      else{
        this.cursor -= 1
      }

    }
    if(key === 'ArrowDown'){

      if(pageIsPost()){
        ev.preventDefault()
        window.scrollBy(0, scrollAmount)
        return
      }

      if(this.cursor === null){
        this.cursor = 0
      }
      else if(this.cursor < this.getStoryList().length - 1 ){
        this.cursor += 1
      }

    }

    if(key === 'ArrowLeft'){
      if (/\/plate/.test(location.pathname)){
        store.history.replace('/plates')
      }
      else{
        this.back()
      }
    }

    if(key === 'ArrowRight'){
      if(this.cursor === null) return
      const items =  Array.from(document.querySelectorAll('.story-list > .story-item'))
      const link = items[this.cursor].querySelector('a.comments')
      link.click()
    }

    this.updateView()
  }

  getStoryList(){
    return Array.from(document.querySelectorAll('.story-list > .story-item'))
  }

  updateView(){
    let list = this.getStoryList()
    for(let [i, item] of list.entries()){

      if(item.classList.contains('cursor-here')){
        item.classList.remove('cursor-here')
      }
      if(i === this.cursor){
        item.classList.add('cursor-here')
      }
    }
  }
}

export default KeyboardNavigator
