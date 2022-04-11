
export default async () => {
	const data = await (await globalThis.fetch("https://raw.githubusercontent.com/FortAwesome/Font-Awesome/6.x/metadata/icons.json")).json();

	const icons: Record<string, any>[] = Object.entries(data).map(([name, { svg: svgObject, free }]: [string, any]) => {
		return free.map((style: string) => ({
			name,
			tags: [...name.split("-"), style],
			svg: svgObject[style].raw,
			style,
		}));
	}).flat();

	return {
		name: "FontAwesome",
		icons,
	};
};
