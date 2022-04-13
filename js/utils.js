
export const $ = (/** @type {string} */ selector, /** @type {HTMLElement | Document | DocumentFragment} */ root = document) => (
	(/** @type {HTMLElement} */ (root?.querySelector(selector)))
);

export const $$ = (/** @type {string} */ selector, /** @type {HTMLElement | Document | DocumentFragment} */ root = document) => (
	(/** @type {HTMLElement[]} */ ([...root?.querySelectorAll(selector)]))
);

export const storage = new class {
	get(/** @type {string} */ key) {
		try {
			return JSON.parse(localStorage.getItem(`${new URL(document.baseURI).pathname}:${key}`));
		} catch (error) {
			console.error(error);
			return null;
		}
	};
	set(/** @type {string} */ key, /** @type {any} */ value) {
		localStorage.setItem(`${new URL(document.baseURI).pathname}:${key}`, JSON.stringify(value));
	};
	remove(/** @type {string} */ key) {
		localStorage.removeItem(`${new URL(document.baseURI).pathname}:${key}`);
	};
};

export const encodeForDataURI = (/** @type {string} */ string) => (
	window.encodeURIComponent(string)
		.replaceAll(window.encodeURIComponent(`"`), `"`)
		.replaceAll(window.encodeURIComponent(` `), ` `)
		.replaceAll(window.encodeURIComponent(`<`), `<`)
		.replaceAll(window.encodeURIComponent(`>`), `>`)
		.replaceAll(window.encodeURIComponent(`=`), `=`)
		.replaceAll(window.encodeURIComponent(`/`), `/`)
		.replaceAll(window.encodeURIComponent(`:`), `:`)
		.replaceAll(`'`, `%27`)
);
