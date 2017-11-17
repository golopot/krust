const pageCache = {}
pageCache.get = function pageCacheGe(key){
  return JSON.parse(window.sessionStorage.getItem(key))
}
pageCache.set = function pageCacheSet(key, value){
  window.sessionStorage.setItem(key, JSON.stringify(value))
}

export default pageCache
