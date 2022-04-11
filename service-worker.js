
/// <reference lib="WebWorker" />

const /** @type {string} */ cacheName = new URL(/** @type {any} */(self).registration.scope).pathname;

const filesToCache = [
	"./",
	"./assets/icon.svg",

	"./css/global.css",
	"./css/header.css",
	"./css/iconList.css",
	"./css/icons.css",
	"./css/iconSetChooser.css",
	"./css/main.css",
	"./css/selectedIcons.css",

	"./js/colorScheme.js",
	"./js/iconSets.js",
	"./js/main.js",
	"./js/utils.js",
	"./js/pwa.js",
];

const addCacheControlHeader = (/** @type {Response} */ response) => {
	response = new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers: response.headers,
	});
	response.headers.set("cache-control", "no-store");
	return response;
};

self.addEventListener("install", async (/** @type {Event} */ event) => {
	const cache = await self.caches.open(cacheName);
	await Promise.all(
		filesToCache.map(async (/** @type {string} */ path) => {
			if (!await cache.match(path)) await cache.put(
				path, addCacheControlHeader(await self.fetch(path, { cache: "force-cache" }))
			);
		})
	);
});

self.addEventListener("fetch", (/** @type {FetchEvent} */ event) => {
	event.respondWith((async () => {
		const response = (
			await (await self.caches.open(cacheName)).match(event.request)
			??
			await (async () => {
				const /** @type {Response} */ response = addCacheControlHeader(await self.fetch(event.request, { cache: "reload" }));
				await (await self.caches.open(cacheName)).put(event.request, response.clone());
				return response;
			})()
		);

		return response;
	})());
});

self.addEventListener("message", async (/** @type {MessageEvent} */ { data: { type }, source }) => {
	$switch: switch (type) {
		case ("checkForUpdate"): {
			const cachedHTML = await (await (await self.caches.open(cacheName)).match("./"))?.text();
			if (!cachedHTML) return;

			const fetchedHTML = await (async () => {
				try { return await (await self.fetch("./", { cache: "reload" }))?.text(); }
				catch { return null; }
			})();
			if (!fetchedHTML) return;

			if (cachedHTML !== fetchedHTML) {
				source.postMessage({ type: "updateAvailable" });
			}
			break $switch;
		}
		case ("getFilesToCache"): {
			source.postMessage({ type: "filesToCache", filesToCache });
			break $switch;
		}
	}
});
