
import { $, encodeForDataURI } from "./utils.js";

import iconsMetadata from "./iconSets.js";
import "./colorScheme.js";
import "./pwa.js";

{
	const iconSetsList = $("#icon-set-list");
	const iconSetFragment = /** @type {HTMLTemplateElement} */ ($(":scope > template", iconSetsList)).content;

	let /** @type {{ set: string, index: number }[]} */ selectedIcons = [];

	const displayIconSet = async (/** @type {string} */ name) => {
		const iconSet = iconsMetadata.find((iconSet) => iconSet.name === name);

		const clone = /** @type {DocumentFragment} */ (iconSetFragment.cloneNode(true));
		$(".name", clone).textContent = iconSet.displayName;
		$("[data-icon-set]", clone).setAttribute("data-icon-set", name);
		const loadingMessage = $(".loading-message", clone);

		const iconsList = $(".icons", clone);

		[...iconSetsList.childNodes].find(({ nodeName, textContent }) => nodeName === "#comment" && textContent === name).replaceWith(clone);

		if (!icons[name]) {
			icons[name] = (await (await window.fetch(`./icons/${name}.min.json`, { cache: "no-store" })).json()).icons;
			const css = icons[name].map(({ svg }, /** @type {number} */ index) => [
				`.icon\\:${name}\\:${index} {`,
				`\t--icon: url('data:image/svg+xml,${encodeForDataURI(svg)}');`,
				`}`,
			].join("\n")).join("\n\n");
			const stylesheet = document.createElement("style");
			stylesheet.textContent = css;
			stylesheet.setAttribute("data-icon-set", name);
			document.head.appendChild(stylesheet);
		} else {
			await new Promise((resolve) => window.requestAnimationFrame(resolve));
		}

		loadingMessage.remove();

		const selectedIconsList = $("#selected-icons");
		const selectedIconFragment = /** @type {HTMLTemplateElement} */ ($(":scope > template", selectedIconsList)).content;

		{
			const iconFragment = /** @type {HTMLTemplateElement} */ ($(":scope > template", iconsList)).content;

			const /** @type {number[]} */ selectedIconsIndices = selectedIcons.filter(({ set }) => set === name).map(({ index }) => index);

			iconsList.append(...icons[name].map(({ name: iconName }, /** @type {number} */ index) => {
				const clone = /** @type {DocumentFragment} */ (iconFragment.cloneNode(true));

				$("[data-icon-index]", clone).setAttribute("data-icon-index", index.toString());
				$(".icon", clone).classList.add(`icon:${name}:${index}`);
				$(".icon-name", clone).textContent = iconName;

				const checkbox = /** @type {HTMLInputElement} */ ($("input[type=checkbox]", clone));

				if (selectedIconsIndices.includes(index)) {
					checkbox.checked = true;
				}

				checkbox.addEventListener("change", function () {
					const iconIndex = +this.closest("[data-icon-index]").getAttribute("data-icon-index");
					const iconSet = this.closest("[data-icon-set]").getAttribute("data-icon-set");

					if (this.checked) {
						const clone = /** @type {DocumentFragment} */ (selectedIconFragment.cloneNode(true));
						$("[data-icon-set]", clone).setAttribute("data-icon-set", iconSet);
						$("[data-icon-index]", clone).setAttribute("data-icon-index", iconIndex.toString());
						$(".icon", clone).classList.add(`icon:${iconSet}:${iconIndex}`);
						$(".icon-name", clone).textContent = iconName;
						$("button", clone).addEventListener("click", function () {
							this.closest("[data-icon-set]").remove();
							selectedIcons = selectedIcons.filter(({ set, index }) => !(set === iconSet && index === iconIndex));
							(/** @type {HTMLInputElement} */ ($(
								`[data-icon-index="${iconIndex}"] input[type=checkbox]`,
								$(`[data-icon-set="${iconSet}"]`, iconSetsList)
							) ?? {})).checked = false;
						});
						selectedIcons.push({
							set: iconSet,
							index: iconIndex,
						});
						selectedIconsList.append(clone);
					} else {
						selectedIcons = selectedIcons.filter(({ set, index }) => !(set === iconSet && index === iconIndex));
						$(`[data-icon-set="${iconSet}"][data-icon-index="${iconIndex}"]`, selectedIconsList)?.remove();
					}
				});
				return clone;
			}));
		}
	};

	{
		const iconSetChooser = $("#icon-set-chooser");
		const iconSetChooserFragment = /** @type {HTMLTemplateElement} */ ($(":scope > template", iconSetChooser)).content;

		for (const iconSet of iconsMetadata) {
			const clone = /** @type {DocumentFragment} */ (iconSetChooserFragment.cloneNode(true));
			$(".name", clone).textContent = iconSet.displayName;
			(/** @type {HTMLAnchorElement} */ ($(".website", clone))).href = iconSet.website;
			(/** @type {HTMLAnchorElement} */ ($(".repository", clone))).href = iconSet.repository;
			$("[data-icon-set]", clone).setAttribute("data-icon-set", iconSet.name);
			const checkbox = /** @type {HTMLInputElement} */ ($("input[type=checkbox]", clone));
			checkbox.checked = iconSet.onByDefault;
			checkbox.addEventListener("change", function () {
				if (this.checked) {
					displayIconSet(this.closest("[data-icon-set]").getAttribute("data-icon-set"));
				} else {
					[...iconSetsList.childNodes].find((/** @type {HTMLElement} */ node) => (
						node.getAttribute?.("data-icon-set") === iconSet.name)
					).replaceWith(document.createComment(iconSet.name));
				}
			});
			iconSetChooser.appendChild(clone);
		}
	}

	const icons = {};

	for (const iconSet of iconsMetadata) {
		iconSetsList.appendChild(document.createComment(iconSet.name));

		if (iconSet.onByDefault) {
			displayIconSet(iconSet.name)
		}
	}

	$("#copy-css").addEventListener("click", async () => {
		const iconsArray = selectedIcons.map(({ set, index }) => icons[set][index]);

		const css = [
			[
				`:where([class^="icon:"], [class*=" icon:"]) {`,
				`\t--size: 1em;`,
				`}\n`,
				`:where([class^="icon:"], [class*=" icon:"])::before {`,
				`\tcontent: "";`,
				`\tdisplay: block;`,
				`\tinline-size: var(--size);`,
				`\taspect-ratio: 1;`,
				`\tbackground-color: currentColor;`,
				`\t-webkit-mask-repeat: no-repeat;`,
				`\tmask-repeat: no-repeat;`,
				`\t-webkit-mask-position: center;`,
				`\tmask-position: center;`,
				`\t-webkit-mask-size: contain;`,
				`\tmask-size: contain;`,
				`\t-webkit-mask-image: var(--icon);`,
				`\tmask-image: var(--icon);`,
				`}`,
			].join("\n"),
			`:root {\n${iconsArray.map(({ svg, name }) => (
				`\t--icon-${name}: url('data:image/svg+xml,${encodeForDataURI(svg)}');`
			)).join("\n")}\n}`,
			iconsArray.map(({ name }) => (
				`.icon\\:${name} {\n\t--icon: var(--icon-${name});\n}`
			)).join("\n\n"),
		].join("\n\n");

		await navigator.clipboard.writeText(css);
	});
}

