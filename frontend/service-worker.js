import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import {NetworkFirst, StaleWhileRevalidate, CacheFirst} from 'workbox-strategies';

precacheAndRoute(self.__WB_MANIFEST || []);

self.addEventListener("push", (event) => {
    const data = event.data?.json() || {};

    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: "/icons/icon-192x192.png",
        })
    );
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow("/")
    );
});

registerRoute(
    ({request}) => request.destination === 'document',
    new NetworkFirst()
);

registerRoute(
    ({request}) => request.destination === 'script',
    new StaleWhileRevalidate()
);

registerRoute(
    ({request}) => request.destination === 'style',
    new StaleWhileRevalidate()
);

registerRoute(
    ({request}) => request.destination === 'image',
    new CacheFirst({
        cacheName: 'images-cache',
    })
);