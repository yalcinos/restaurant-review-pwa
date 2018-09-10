
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  }

  );
}

var staticCacheName ='restaurant-v1';

self.addEventListener('install',function(event){

//distler eklendi.
	var urlsToCache=[
		'/',
		'js/dbhelper.js',
		'js/main.js',
		'js/restaurant_info.js',
		'css/styles.css',
		'img',
		'sw.js',
		'restaurant.html',
		'images',
		'dist/js/mainpage.min.js',
		'dist/js/rest-page.min.js',
		'dist/js/idb.js',
		'dist/js/idb-restaurant.js'
	];

	event.waitUntil(
			caches.open(staticCacheName).then(function(cache){
				return cache.addAll(urlsToCache);
			})
		)

});

self.addEventListener('fetch',function(event){
	event.respondWith(
		caches.match(event.request,{ignoreSearch:true}).then(function(response){
			return response || fetch(event.request);
		})
	);
});

self.addEventListener('activate',function(event){
	event.waitUntil(
		
			//get all cache name that exist.
			caches.keys().then(function(cacheNames){

				return Promise.all(
		cacheNames.filter(function(cacheName){
					return cacheName.startsWith('restaurant-') && cacheName != staticCacheName;
					}).map(function(cacheName){
				return caches.delete(cacheName);
				})
			);
				
		})
			
	);	
});

