export const dq = x => document.querySelector(x)

export const formToObj = form => {
  var obj = {}
  for(let key of form.keys()){
    obj[key] = form.get(key)
  }
  return obj
}


export const getStoryId = () => {
  return document.querySelector('#data-story-id').innerHTML
}



export const getUsername = () => {
  const m = /authtoken=(.+?)\./.exec(document.cookie)
  return m ? m[1] : false
}
