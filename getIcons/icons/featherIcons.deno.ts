
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.21-alpha/deno-dom-wasm.ts";

export default async () => {
	const tagsData = await (await globalThis.fetch("https://github.com/feathericons/feather/raw/master/src/tags.json")).json();
	tagsData["life-buoy"] = tagsData["life-bouy"];
	delete tagsData["life-bouy"];

	const icons: Record<string, any>[] = await Promise.all(Object.entries(tagsData).map(async ([name, tags]: any) => {
		const svg = new DOMParser().parseFromString(
			(await (await globalThis.fetch(`https://raw.githubusercontent.com/feathericons/feather/master/icons/${name}.svg`)).text())
				.replaceAll("\r", "")
				.replaceAll(`"currentColor"`, `"black"`)
				.replaceAll(/\>\n\s*\</g, "><"),
			"text/html",
		)!.body.firstElementChild!;

		svg.removeAttribute("width");
		svg.removeAttribute("height");

		return {
			name,
			tags: [...name.split("-"), ...tags],
			svg: svg.outerHTML.replace(` viewbox=`, ` viewBox=`),
		};
	}));

	return {
		name: "Feather icons",
		icons,
	};
};
