const CACHE = 'v1'

self.addEventListener( 'install', event => {

	console.log( 'install', event )

	event.waitUntil(
                caches.open( CACHE )
                        .then( cache => {

				return cache.add(
					'/offline'
				)

			} )
                        .then( () => {

				self.skipWaiting()

			} )
	)

} )

self.addEventListener( 'fetch', event => {

	console.log( 'fetch', event )
	console.log( 'mode', event.request.mode )

	event.respondWith( async function() {

	        return caches.open( CACHE )
			.then( cache => {

				return cache.match( event.request )
					.then( response => response ? response : Promise.reject() )
                                        .then( match => match )
                                        .catch( err => {

						cache.add( event.request )

						return fetch( event.request )

					} )
					.catch( err => {

						console.log( err )

						return caches.open( CACHE ).then( cache => {

							return cache.match( '/offline' )

						} )

					} )

			} )

	}() )

} )
