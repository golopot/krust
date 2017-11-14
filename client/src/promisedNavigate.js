import pathToResources from './pathToResources'
import store from './store'

export default (to) => {
  const history = store.history
  const resources = pathToResources(to).map(
    uri => fetch(uri)
      .then( r => r.json() )
      .then( r => {
        if(r.error){
          throw r.error
        }
        else{
          store.resources[uri] = r
        }
      })
      .catch(console.error)
  )

  return Promise.all(resources)
    .then( () => {
      history.push(to)
    })
    .catch(console.error)
}
