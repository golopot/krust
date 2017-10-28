import qs from 'qs'
import config from './config'
import {dq, formToObj} from './utils'
import dateStringify from './dateStringify'
import Preact from 'preact'

function popError(e){
  console.error(e)
  dq('#message-popup').innerHTML = `<div>${e}</div>`

}

function popMessage(msg){
  console.log(msg)
  dq('#message-popup').innerHTML = `<div>${msg}</div>`
}

if( dq('.story-list') ){
  const dates = Array.from(document.querySelectorAll('.story-list .date-submit'))
  for(let date of dates){
    date.innerHTML = dateStringify( new Date( parseInt(date.innerHTML)) )
  }
}



import './components/comment'
import './components/story'
import './components/auth'
