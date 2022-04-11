
import { $, $$, storage } from "./utils.js";

const colorSchemeChooser = $("#color-scheme-chooser");
const mediaMatch = window.matchMedia("(prefers-color-scheme: light)");
const setColorScheme = (/** @type {string} */ colorScheme) => {
	if (colorScheme === "os-default") {
		document.documentElement.setAttribute("data-color-scheme", (
			mediaMatch.matches ? "light" : "dark"
		));
		storage.set("appearance", {});
	} else {
		document.documentElement.setAttribute("data-color-scheme", colorScheme);
		storage.set("appearance", { colorScheme });
	}
};

let /** @type {string} */ colorScheme;

{
	if (colorScheme = storage.get("appearance")?.colorScheme) {
		setColorScheme(colorScheme);
		(/** @type {HTMLInputElement} */ ($(`[data-color-scheme="${colorScheme}"]`, colorSchemeChooser))).checked = true;
	} else {
		setColorScheme(colorScheme = "os-default");
		(/** @type {HTMLInputElement} */ ($(`[data-color-scheme="os-default"]`, colorSchemeChooser))).checked = true;
	}
}

for (const radio of $$("[data-color-scheme]", colorSchemeChooser)) {
	radio.addEventListener("change", function () {
		setColorScheme(colorScheme = this.getAttribute("data-color-scheme"));
	});
}

mediaMatch.addEventListener("change", () => {
	if (colorScheme === "os-default") {
		setColorScheme("os-default");
	}
});

