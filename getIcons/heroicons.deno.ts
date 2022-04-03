

export default async () => {
	const data = Object.entries((await import(URL.createObjectURL(new Blob([
		await (await globalThis.fetch("https://raw.githubusercontent.com/tailwindlabs/heroicons.com/master/src/data/tags.js")).text()
	], { type: "text/javascript" })))).default).map(([name, tags]: any[]) => ({
		name: name as string,
		tags: [...new Set([...name.split("-"), ...tags.map((tag: string) => tag.split("-")).flat()])] as string[],
	}));

	const icons: Record<string, any>[] = await Promise.all(["outline", "solid"].map(async (type: string) => await Promise.all(data.map(async ({ name, tags }) => {
		const svg: string = (await (await globalThis.fetch(`https://raw.githubusercontent.com/tailwindlabs/heroicons/master/optimized/${type}/${name}.svg`)).text())
			.replaceAll("\r", "")
			.replace(/ fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true"/, ` viewBox="0 0 24 24"`)
			.replace(/ viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"/, ` viewBox="0 0 20 20"`)
			.replaceAll(/\>\n\s*\</g, "><");

		return {
			name,
			tags: [...new Set([...tags, type])],
			svg,
		};
	}))).flat());

	return {
		name: "Heroicons",
		website: "https://heroicons.com",
		repository: "https://github.com/tailwindlabs/heroicons",
		icons,
	};
}
