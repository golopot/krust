const pathToResources = (href) => {

  const noHash = /^[^#]*/.exec(href)[0]
  let [ _, path, query] = /^([^?]*)(.*)/.exec(noHash)

  const q = query || ''
	let m
  if(path === '/'){

	}
	if(m = /^\/p\/([\w]*)/.exec(path)){
		return [`/api/story/${m[1]}${q}`]
	}
  if(m = /^\/plate\/([\w]*)/.exec(path)){
    return [`/api/plate/${m[1]}${q}`]
  }
  return []
}


export default pathToResources
