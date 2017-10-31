// Embed this script in html to request initial data.
// Doing this reduces latency by one round trip.

;(() => {
	let resources = []
	const path = window.location.pathname
	let r

	if(path === '/'){
		resources.push(['/api/stories'])
	}
	if(r = /^\/p\/([\w]*)/.exec(path)){
		resources.push([`/api/story/${r[1]}`])
	}

	window.REACT_INIT_LOADER = {
		endpoints: resources,
		fetches: resources.map( x => fetch(x)
			.then( r => r.json() )
			.catch( e => console.error(e) )
		)
	}

})()
