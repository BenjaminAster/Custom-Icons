
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.21-alpha/deno-dom-wasm.ts";

export default async () => {
	const data = (Object.keys(await (await globalThis.fetch(
		`https://github.com/google/material-design-icons/raw/master/update/current_versions.json`
	)).json()).map((string: string) => string.split("::").reverse()));

	const icons: Record<string, any>[] = (await Promise.all(data.map(async ([name, category]: string[]) => {
		return (await Promise.all([
			"",
			"Outlined",
			"Round",
			"Sharp",
		].map(async (style: string) => {
			const svg = new DOMParser().parseFromString(
				(await (await globalThis.fetch(
					`https://raw.githubusercontent.com/google/material-design-icons/master/src/${category}/${name}/materialicons${style.toLowerCase()}/24px.svg`
				)).text())
					.replaceAll("\r", "")
					.replaceAll(`"currentColor"`, `"black"`)
					.replaceAll(/\>\n\s*\</g, "><"),
				"text/html",
			)?.body?.firstElementChild!;

			if (!svg) return undefined!;

			try {
				svg.removeAttribute("width");
				svg.removeAttribute("height");
			} catch (error) {
				throw new Error(`${name} ${style}: ${error}`);
			}

			name = name.replaceAll("_", "-");

			return {
				name,
				tags: [...name.split("-"), ...(style ? [style.toLowerCase()] : [])],
				svg: svg.outerHTML,
			};
		}))).filter(Boolean);
	}))).flat();

	return {
		name: "Material icons",
		website: "https://fonts.google.com/icons",
		repository: "https://github.com/google/material-design-icons",
		icons,
	};
};

