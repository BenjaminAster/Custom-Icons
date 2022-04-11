
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.21-alpha/deno-dom-wasm.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async () => {

	const icons: Record<string, any>[] = (await Promise.all([
		["logos", "bxl"],
		["regular", "bx"],
		["solid", "bxs"],
	].map(async ([style, shortName]: string[]) => {
		const names = (await (await globalThis.fetch(`https://api.github.com/repos/atisawd/boxicons/contents/svg/${style}`)).json()).map(
			({ name: fileName }: { name: string }) => fileName.replace(new RegExp(`^${shortName}-(?<fileName>.+)\\.svg$`), "$<fileName>")
		);

		return await Promise.all(names.map(async (name: string) => {

			await sleep(Math.random() * 10_000);

			const svg = new DOMParser().parseFromString(
				(await (await globalThis.fetch(`https://raw.githubusercontent.com/atisawd/boxicons/master/svg/${style}/${shortName}-${name}.svg`)).text())
					.replaceAll("\r", "")
					.replaceAll(`"currentColor"`, `"black"`)
					.replaceAll(/\>\n\s*\</g, "><"),
				"text/html",
			)!.body.firstElementChild!;

			svg.removeAttribute("width");
			svg.removeAttribute("height");
			svg.setAttribute("viewbox", "0 0 24 24");

			return {
				name,
				tags: name.split("-"),
				svg: svg.outerHTML.replace(` viewbox=`, ` viewBox=`),
				style,
			};
		}));

	}))).flat();

	return {
		name: "Boxicons",
		icons,
	};
};

