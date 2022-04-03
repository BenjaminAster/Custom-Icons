
const names: string[] = Object.keys(await (await globalThis.fetch("https://raw.githubusercontent.com/twbs/icons/main/font/bootstrap-icons.json")).json());

// names.splice(30);

export default async () => {
	const icons: Record<string, any>[] = await Promise.all(names.map(async (name: string) => {
		const svg = (await (await globalThis.fetch(`https://raw.githubusercontent.com/twbs/icons/main/icons/${name}.svg`)).text())
			.replaceAll("\r", "")
			.replace(/( width="16" height="16" fill="currentColor" class="bi [\w-]+" viewBox="0 0 16 16")/, ` viewBox="-1 -1 18 18"`)
			.replaceAll(/\>\n\s*\</g, "><");
		const metaMarkdown = (await (await globalThis.fetch(`https://raw.githubusercontent.com/twbs/icons/main/docs/content/icons/${name}.md`)).text()).replaceAll("\r", "");

		const tags: string[] = [...new Set([
			...name.split("-"),
			...[...metaMarkdown.match(/tags\:\s*\n(?<tags>.+)\n---\n?$/s)?.groups!.tags!.matchAll(/^\s*-\s*(?<tag>.+)$/gm) ?? []].map(({ groups }) => groups!.tag!.trim().split("-")).flat()
		])];

		return {
			name,
			tags,
			svg,
		};
	}));

	return {
		name: "Bootstrap icons",
		website: "https://icons.getbootstrap.com",
		repository: "https://github.com/twbs/icons",
		icons,
	};
};
