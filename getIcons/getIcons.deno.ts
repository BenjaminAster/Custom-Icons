
/*

deno run --unstable --allow-read --allow-write=. --allow-net getIcons/getIcons.deno.ts

*/

// @ts-ignore
import bootstrapIcons from "./bootstrapIcons.deno.ts";

// @ts-ignore
import heroicons from "./heroicons.deno.ts";

const icons = {
	"bootstrap-icons": await bootstrapIcons(),
	heroicons: await heroicons(),
};

for (const [name, data] of Object.entries(icons)) {
	await Deno.writeTextFile(`./icons/${name}.min.json`, JSON.stringify(data));
	await Deno.writeTextFile(`./icons/${name}.json`, JSON.stringify(data, null, "\t"));
}

