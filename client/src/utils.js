const dq = x => document.querySelector(x)

const formToObj = form => {
  var obj = {}
  for(let key of form.keys()){
    obj[key] = form.get(key)
  }
  return obj
}


const getStoryId = () => {
  return document.querySelector('#data-story-id').innerHTML
}


export{
  dq,
  formToObj,
  getStoryId,
}
