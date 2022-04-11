
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.21-alpha/deno-dom-wasm.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async () => {
	const icons: Record<string, any>[] = (await Promise.all(["line", "solid"].map(async (style: string) => {

		const names = await (await globalThis.fetch(`https://api.github.com/repos/halfmage/majesticons/contents/${style}`)).json();

		return await Promise.all(names.map(async ({ name: fileName }: { name: string }) => {
			const name = fileName.replace(/\.svg$/, "");

			await sleep(Math.random() * 10_000);

			const svg = new DOMParser().parseFromString(
				(await (await globalThis.fetch(`https://raw.githubusercontent.com/halfmage/majesticons/main/${style}/${name}.svg`)).text())
					.replaceAll("\r", "")
					.replaceAll(`"currentColor"`, `"black"`)
					.replaceAll(/\>\n\s*\</g, "><"),
				"text/html",
			)!.body.firstElementChild!;

			return {
				name,
				tags: name.split("-"),
				svg: svg.outerHTML.replace(` viewbox=`, ` viewBox=`),
				style,
			};
		}));
	}))).flat();

	return {
		name: "Majesticons",
		icons,
	};
};
