
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.21-alpha/deno-dom-wasm.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async () => {
	let names = await (await globalThis.fetch("https://api.github.com/repos/twbs/icons/contents/icons")).json();

	const icons: Record<string, any>[] = await Promise.all(names.map(async ({ name: fileName }: { name: string }) => {
		const name = fileName.replace(/\.svg$/, "");

		await sleep(Math.random() * 10_000);

		const svg = new DOMParser().parseFromString(
			(await (await globalThis.fetch(`https://raw.githubusercontent.com/twbs/icons/main/icons/${name}.svg`)).text())
				.replaceAll("\r", "")
				.replaceAll(`"currentColor"`, `"black"`)
				.replaceAll(/\>\n\s*\</g, "><"),
			"text/html",
		)!.body.firstElementChild!;

		svg.removeAttribute("width");
		svg.removeAttribute("height");
		svg.removeAttribute("class");
		svg.setAttribute("viewBox", "-1 -1 18 18");

		const metaMarkdown = (await (await globalThis.fetch(`https://raw.githubusercontent.com/twbs/icons/main/docs/content/icons/${name}.md`)).text()).replaceAll("\r", "");

		const tags: string[] = [...new Set([
			...name.split("-"),
			...[...metaMarkdown.match(/tags\:\s*\n(?<tags>.+)\n---\n?$/s)?.groups!.tags!.matchAll(/^\s*-\s*(?<tag>.+)$/gm) ?? []].map(({ groups }) => groups!.tag!.trim().split("-")).flat()
		])];

		return {
			name,
			tags,
			svg: svg.outerHTML,
		};
	}));

	return {
		name: "Bootstrap icons",
		website: "https://icons.getbootstrap.com",
		repository: "https://github.com/twbs/icons",
		icons,
	};
};
