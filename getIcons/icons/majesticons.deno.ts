
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.21-alpha/deno-dom-wasm.ts";

export default async () => {
	const icons: Record<string, any>[] = await Promise.all(["line", "solid"].map(async (type: string) => {

		const names = await (await globalThis.fetch(`https://api.github.com/repos/halfmage/majesticons/contents/${type}`)).json();

		return await Promise.all(names.map(async ({ name: fileName }: { name: string }) => {
			const name = fileName.replace(/\.svg$/, "");

			const svg = new DOMParser().parseFromString(
				(await (await globalThis.fetch(`https://raw.githubusercontent.com/halfmage/majesticons/main/${type}/${name}.svg`)).text())
					.replaceAll("\r", "")
					.replaceAll(`"currentColor"`, `"black"`)
					.replaceAll(/\>\n\s*\</g, "><"),
				"text/html",
			)!.body.firstElementChild!;

			return {
				name,
				tags: name.split("-"),
				svg: svg.outerHTML,
			};
		}));
	}).flat());

	return {
		name: "Majesticons",
		website: "https://majesticons.com",
		repository: "https://github.com/halfmage/majesticons",
		icons,
	};
};
