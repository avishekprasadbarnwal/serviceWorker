//  Adding logics for the Service worker

// Checking if the browser supports the service worker
if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js')
        .then((reg) => console.log("service worker is registered", reg))
        .catch((err) => console.log("Service worker is not registered", err))
}