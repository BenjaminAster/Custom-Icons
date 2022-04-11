
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.21-alpha/deno-dom-wasm.ts";

export default async () => {
	const tagsData = await (await globalThis.fetch("https://raw.githubusercontent.com/tabler/tabler-icons/master/tags.json")).json();

	const icons: Record<string, any>[] = await Promise.all(Object.entries(tagsData).map(async ([name, { tags }]: [string, any]) => {
		const svg = new DOMParser().parseFromString(
			(await (await globalThis.fetch(`https://raw.githubusercontent.com/tabler/tabler-icons/master/icons/${name}.svg`)).text())
				.replaceAll("\r", "")
				.replaceAll(`"currentColor"`, `"black"`)
				.replaceAll(/\>\n\s*\</g, "><"),
			"text/html",
		)!.body.firstElementChild!;

		svg.removeAttribute("width");
		svg.removeAttribute("height");
		svg.removeAttribute("class");
		svg.removeAttribute("aria-hidden");

		return {
			name,
			tags,
			svg: svg.outerHTML.replace(` viewbox=`, ` viewBox=`),
		};
	}));

	return {
		name: "Tabler icons",
		icons,
	};
};
