import store from './store'

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
      if(this.cursor === null){
        this.cursor = 0
      }
      else if(this.cursor < this.getStoryList().length - 1 ){
        this.cursor += 1
      }

    }

    if(key === 'ArrowLeft'){
      this.back()
    }

    if(key === 'ArrowRight'){
      if(this.cursor === null) return
      const items =  Array.from(document.querySelectorAll('.story-list > .story-item'))
      const link = items[this.cursor].querySelector('.up > a')
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
