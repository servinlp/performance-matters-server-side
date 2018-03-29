self.addEventListener('install', event => {

	console.log( 'install', event )

	return event.waitUntil(
	    caches.open('bs-v1-core')
	        .then(cache => cache.addAll([
		    '/offline',
	            '/public/css/style.css',
		    'https://fonts.googleapis.com/css?family=Roboto:400,700',
	            '/public/js/index.js',
		    '/public/js/ejs.min.js'
	        ]))
		.then(self.skipWaiting())
	)
} );

self.addEventListener('fetch', event => {

	console.log( 'fetch', event )

    const request = event.request;

    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then(response => cachePage(request, response))
                .catch(err => getCachedPage(request))
                .catch(err => fetchCoreFile('/offline/'))
        );
    } else {
        event.respondWith(
            fetch(request)
                .catch(err => fetchCoreFile(request.url))
                .catch(err => fetchCoreFile('/offline/'))
        );
    }
});

function fetchCoreFile(url) {
    return caches.open('bs-v1-core')
        .then(cache => cache.match(url))
        .then(response => response ? response : Promise.reject());
}

function getCachedPage(request) {
    return caches.open('bs-v1-pages')
        .then(cache => cache.match(request))
        .then(response => response ? response : Promise.reject());
}

function cachePage(request, response) {
    const clonedResponse = response.clone();
    caches.open('bs-v1-pages')
        .then(cache => cache.put(request, clonedResponse));
    return response;
}
