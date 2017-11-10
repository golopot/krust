// Embed this script in html to request initial data.
// Doing this reduces latency by one round trip.

;(() => {


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

	const alwaysResources = () => {
		if(document.cookie.search('authtoken=') !== -1){
			return ['/api/user-votes']
		}
		else{
			return []
		}
	}


	const executeFetches = () => {
		const uris = pathToResources(window.location.pathname + window.location.search)
			.concat(alwaysResources())
		const fetches = uris.map( uri =>
			fetch(uri,{
				credentials: 'include',
				headers: {'X-CSRF-Prevention': 1},
			})
			.then(r => r.json())
		)

		window.INIT_FETCHES = Promise.all(fetches)
		.then( r => {
			let table = {}
			for(let i=0; i<uris.length; i++){
				table[uris[i]] = r[i]
			}
			return table
		})
		.catch(console.error)
	}

	executeFetches()

})()
