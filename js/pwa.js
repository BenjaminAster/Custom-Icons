
navigator.serviceWorker?.register("./service-worker.js", { scope: "./", updateViaCache: "all" });

const update = async () => {
	await window.caches.delete(new URL((await navigator.serviceWorker?.ready)?.scope)?.pathname);

	const /** @type {string[]} */ filesToCache = await new Promise(async (resolve) => {
		navigator.serviceWorker?.addEventListener("message", ({ data: { type, filesToCache } }) => {
			if (type === "filesToCache") {
				resolve(filesToCache);
			}
		});
		(await navigator.serviceWorker?.ready)?.active.postMessage({ type: "getFilesToCache" });
	});

	await Promise.all(filesToCache.map(async (file) => await window.fetch(file, { cache: "reload" })));

	await (await navigator.serviceWorker?.ready)?.unregister();
};

navigator.serviceWorker?.addEventListener("message", async ({ data: { type } }) => {
	if (type === "updateAvailable") {
		await update();
	}
});

{
	const checkReadyState = async () => {
		if (document.readyState === "complete" && navigator.onLine) {
			(await navigator.serviceWorker?.ready)?.active.postMessage({ type: "checkForUpdate" });
		}
	};
	checkReadyState();
	document.addEventListener("readystatechange", checkReadyState);
}

export { };
