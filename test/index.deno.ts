
/* 

deno run --unstable --allow-read --allow-write=. --allow-net test/index.deno.ts

*/

const iconNames = [
	"box-arrow-up-right",
	"github",
	"check-lg",
	"x-lg",
	"sun-fill",
	"moon-fill",
	"circle-half",
];

{
	const icons = (
		await Promise.all(
			iconNames.map(
				async (iconName: string) => ({
					name: iconName,
					svg: await (await globalThis.fetch(
						`https://raw.githubusercontent.com/twbs/icons/main/icons/${iconName}.svg`
					)).text(),
				})
			)
		)
	).map(
		({ svg, name }) => ({
			name,
			uri: `data:image/svg+xml,` + (
				globalThis.encodeURI(
					svg.replaceAll(/[\n]/g, "")
				).replaceAll(
					encodeURI(`"`), `"`
				).replaceAll(
					encodeURI(` `), ` `
				).replaceAll(
					encodeURI(`<`), `<`
				).replaceAll(
					encodeURI(`>`), `>`
				).replaceAll(
					`'`, `%27`
				).replace(/( width="16" height="16" fill="currentColor" class="bi [a-z-]+" viewBox="0 0 16 16")/, ` viewBox="-1 -1 18 18"`)
			),
		})
	);

	await Deno.writeTextFile(
		`./test/icons.css`,
		[
			`:where([class^="icon:"], [class*=" icon:"]) {`,
			`--size: 1em;`,
			`}\n`,
			`:where([class^="icon:"], [class*=" icon:"])::before {`,
			`content: "";`,
			`display: block;`,
			`inline-size: var(--size);`,
			`aspect-ratio: 1;`,
			`background-color: currentColor;`,
			`-webkit-mask-repeat: no-repeat;`,
			`mask-repeat: no-repeat;`,
			`-webkit-mask-position: center;`,
			`mask-position: center;`,
			`-webkit-mask-size: contain;`,
			`mask-size: contain;`,
			`-webkit-mask-image: var(--icon);`,
			`mask-image: var(--icon);`,
			`}\n`,
		].join(" ")
		+ `:root { ${icons.map(({ uri, name }) => `--icon-${name}: url('${uri}');`).join(" ")} }\n`
		+ icons.map(
			({ name }) => `.icon\\:${name} { --icon: var(--icon-${name}); }`
		).join("\n"),
	);
};


export { };
