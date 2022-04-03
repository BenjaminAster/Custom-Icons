
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.21-alpha/deno-dom-wasm.ts";

export default async () => {
	const data = await (await globalThis.fetch("https://raw.githubusercontent.com/astrit/css.gg/master/icons/all.json")).json();

	const icons: Record<string, any>[] = Object.entries(data).map(([name, [[{ svg_path: svgString }]]]: [string, any]) => {
		const svg = new DOMParser().parseFromString(
			svgString
				.replaceAll("\r", "")
				.replaceAll(`"currentColor"`, `"black"`)
				.replaceAll(/\>\n\s*\</g, "><"),
			"text/html",
		)!.body.firstElementChild!;

		svg.removeAttribute("width");
		svg.removeAttribute("height");

		return {
			name,
			tags: name.split("-"),
			svg: svg.outerHTML,
		};
	});

	return {
		name: "CSS.gg",
		website: "https://css.gg/app",
		repository: "https://github.com/astrit/css.gg",
		icons,
	};
};
