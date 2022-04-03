
/* 

deno run --unstable --allow-read --allow-write=. --allow-net test/index.deno.ts

*/

const icons = [
	"brightness-high-fill",
	"moon-fill",
	"window-stack",
	"fullscreen",
	"fullscreen-exit",
	"arrow-repeat",
	"share-fill",
	"app-indicator",
	"box-arrow-up-right",
	"github",
	"trash-fill",
	"arrow-left-short",
	"arrow-clockwise",
];


(async () => {
	await Deno.writeTextFile(
		`./icons.css`,
		[
			`:is([class^="bi-"], [class*=" bi-"])::before {`,
			`content: "";`,
			`display: inline-block;`,
			`height: 1em;`,
			`width: 1em;`,
			`background-color: currentColor;`,
			`-webkit-mask-repeat: no-repeat;`,
			`mask-repeat: no-repeat;`,
			`-webkit-mask-size: contain;`,
			`mask-size: contain;`,
			`-webkit-mask-image: var(--_);`,
			`mask-image: var(--_);`,
			// `transform: translate(0.07em, 0.07em);`,
			`}\n`,
		].join(" ") + (
			await Promise.all(
				// Object.keys(
				// 	await (await globalThis.fetch(
				// 		`https://raw.githubusercontent.com/twbs/icons/main/font/bootstrap-icons.json`
				// 	)).json()
				// ).map(
				// 	async (iconName: string) => ({
				// 		name: iconName,
				// 		svg: await (await globalThis.fetch(
				// 			`https://raw.githubusercontent.com/twbs/icons/main/icons/${iconName}.svg`
				// 		)).text(),
				// 	})
				// )

				icons.map(
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
						// ).replace(`viewBox="0 0 16 16"`, `viewBox="0 0 18 18"`)
					).replace(/( width="16" height="16" fill="currentColor" class="bi [a-z-]+" viewBox="0 0 16 16")/, ` viewBox="-1 -1 18 18"`)
				),
			})
		).map(
			({ uri, name }) => `.bi-${name}::before{--_:url('${uri}')}`
		).join("\n"),
	);
})();


export { };
