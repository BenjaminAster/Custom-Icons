
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.21-alpha/deno-dom-wasm.ts";

export default async () => {
	const data = Object.entries((await import(URL.createObjectURL(new Blob([
		await (await globalThis.fetch("https://raw.githubusercontent.com/tailwindlabs/heroicons.com/master/src/data/tags.js")).text()
	], { type: "text/javascript" })))).default).map(([name, tags]: any[]) => ({
		name: name as string,
		tags: [...new Set([...name.split("-"), ...tags.map((tag: string) => tag.split("-")).flat()])] as string[],
	}));

	const icons: Record<string, any>[] = await Promise.all(["outline", "solid"].map(async (type: string) => await Promise.all(data.map(async ({ name, tags }) => {
		const svg = new DOMParser().parseFromString(
			(await (await globalThis.fetch(`https://raw.githubusercontent.com/tailwindlabs/heroicons/master/optimized/${type}/${name}.svg`)).text())
				.replaceAll("\r", "")
				.replaceAll(`"currentColor"`, `"black"`)
				.replaceAll(/\>\n\s*\</g, "><"),
			"text/html",
		)!.body.firstElementChild!;

		svg.removeAttribute("aria-hidden");

		return {
			name,
			tags: [...new Set([...tags, type])],
			svg: svg.outerHTML,
		};
	}))).flat());

	return {
		name: "Heroicons",
		website: "https://heroicons.com",
		repository: "https://github.com/tailwindlabs/heroicons",
		icons,
	};
};
