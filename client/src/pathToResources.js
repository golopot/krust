
const pathToResources = (path) => {
  const resources = []
	let r
  if(path === '/'){
		resources.push(['/api/stories'])
	}
	if(r = /^\/p\/([\w]*)/.exec(path)){
		resources.push([`/api/story/${r[1]}`])
	}
	return resources
}


export default pathToResources
