
/*

deno run --unstable --allow-read --allow-write=. --allow-net getIcons/getIcons.deno.ts

*/

import bootstrapIcons from "./icons/bootstrapIcons.deno.ts";
import heroicons from "./icons/heroicons.deno.ts";
import tablerIcons from "./icons/tablerIcons.deno.ts";
import majesticons from "./icons/majesticons.deno.ts";
import featherIcons from "./icons/featherIcons.deno.ts";
import fontAwesome from "./icons/fontAwesome.deno.ts";
import cssgg from "./icons/cssgg.deno.ts";
import materialIcons from "./icons/materialIcons.deno.ts";
import boxIcons from "./icons/boxIcons.deno.ts";

const icons = {
	"bootstrap-icons": await bootstrapIcons(),
	heroicons: await heroicons(),
	"tabler-icons": await tablerIcons(),
	majesticons: await majesticons(),
	"feather-icons": await featherIcons(),
	"font-awesome": await fontAwesome(),
	"css-gg": await cssgg(),
	"material-icons": await materialIcons(),
	"box-icons": await boxIcons(),
};

for (const [name, data] of Object.entries(icons)) {
	await Deno.writeTextFile(`./icons/${name}.min.json`, JSON.stringify(data));
	await Deno.writeTextFile(`./icons/${name}.json`, JSON.stringify(data, null, "\t"));
}

