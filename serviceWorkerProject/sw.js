const staticCacheName = 'site-static-v1';
const dynamicCacheName = 'site-dynamic-v1';
const assets = [
  '/',
  '/index.html',
  '/js/app.js',
  '/pages/fallback.html'
];

// cache size limit function
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if(keys.length > size){
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};

// install event
self.addEventListener('install', evt => {
  //console.log('service worker installed');
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      console.log('caching shell assets');
      cache.addAll(assets);
    })
  );
});

// activate event
self.addEventListener('activate', evt => {
  //console.log('service worker activated');
  evt.waitUntil(
    caches.keys().then(keys => {
      //console.log(keys);
      return Promise.all(keys
        .filter(key => key !== staticCacheName && key !== dynamicCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});

// fetch event
self.addEventListener('fetch', evt => {
  //console.log('fetch event', evt);
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request).then(fetchRes => {
        return caches.open(dynamicCacheName).then(cache => {
          cache.put(evt.request.url, fetchRes.clone());
          // check cached items size
          limitCacheSize(dynamicCacheName, 15);
          return fetchRes;
        })
      });
    }).catch(() => {
      if(evt.request.url.indexOf('.html') > -1){
        return caches.match('/pages/fallback.html');
      } 
    })
  );
});

// const staticCacheName = 'site-static-v3';
// const dynamicCacheName = 'site-dynamic-v7';
// const assets = [
//     '/',
//     '/index.html',
//     '/app.js',
//     '/img/dish.png',
// ];

// self.addEventListener('install', evt => {
    
//     evt.waitUntil(
//         caches.open(staticCacheName).then(cache => {
//             console.log('caching shell assests');
//             cache.addAll(assets);
//         })
//     );
    
// });


// self.addEventListener('activate', evt => {
//     evt.waitUntil(
//         caches.keys().then(keys => {
//           //console.log(keys);
//           return Promise.all(keys
//             .filter(key => key !== staticCacheName && key !== dynamicCacheName)
//             .map(key => caches.delete(key))
//           );
//         })
//     );
// });


// self.addEventListener('fetch', evt => {
//     evt.respondWith(
//         caches.match(evt.request).then(cacheRes => {
//           return cacheRes || fetch(evt.request).then(fetchRes => {
//             return caches.open(dynamicCacheName).then(cache => {
//               cache.put(evt.request.url, fetchRes.clone());
//               // check cached items size
//               limitCacheSize(dynamicCacheName, 15);
//               return fetchRes;
//             })
//           });
//         }).catch(() => {
//           if(evt.request.url.indexOf('.html') > -1){
//             return caches.match('/pages/fallback.html');
//           } 
//         })
//     );
// });

// // const staticCacheName = 'site-static-v1';
// // const dynamicCacheName = 'dynamicCache-version-1';

// // const assets = [
// //     '/',
// //     '/index.js',
// //     // '/img/dish.png'
// // ];

// // // adding an event listener that will check the install event of the service worker
// // // Event listener will also help us to save our assets to the cache in offline mode so that user can view it later 
// // self.addEventListener('install', (evt) => {
// //     // console.log("service worker is installed");
// //     // NOTE : Caching the data that doesnot need replacements very frequently live homeScreen, css etc should be done during the installation
    
// //     //waitUntil method helps to wait the browser to wait until the whole caching of the data that need to cache is done
// //     //and when once done then it call the install service worker in event 'evt' variable


// //         //Opening the static cache and as this is a async parameter hence it takes promises
// //     evt.waitUntil(
// //         caches.open(staticCacheName).then((cache) => {
// //             console.log("caching shell assets");
// //             cache.addAll(assets);
// //         })
// //     );
    
// // });


// // // Activating the service worker after it is installed successfully
// // self.addEventListener('activate', (evt) => {
// //     // console.log("service worker has been successfully activated");
// // });


// // // Adding a fetch event, It occurs whenever there is a request to get some data from the server or any other kind of fetch request
// // self.addEventListener('fetch', (evt) => {
// //     // console.log("fetched events", evt);
// // });
