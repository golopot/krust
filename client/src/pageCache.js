const pageCache = {}
pageCache.get = function pageCacheGet(key) {
  const value = window.sessionStorage.getItem(key)
  if (value === null) throw new Error('pageCache miss')
  return JSON.parse(value)
}
pageCache.set = function pageCacheSet(key, value) {
  window.sessionStorage.setItem(key, JSON.stringify(value))
}

export default pageCache
