import reloadOnUpdate from "virtual:reload-on-update-in-background-script";
import _ from 'lodash';

reloadOnUpdate("pages/background");

/**
 * Extension reloading is necessary because the browser automatically caches the css.
 * If you do not use the css of the content script, please delete it.
 */
reloadOnUpdate("pages/content/style.scss");


const knapsack = (items, total) => {
	// memoization baby
	const cache = new Map();

	const knapsackHelper = (n, w) => {
		if (n === 0 || w === 0) {
			return 0;
		}

		const key = `${n}-${w}`;
		if (cache.has(key)) {
			return cache.get(key);
		}

		const price = items[n - 1].product_variations.price;
		if (price > w) {
			const result = knapsackHelper(n - 1, w);
			cache.set(key, result);
			return result;
		}

		const result = Math.max(
			knapsackHelper(n - 1, w),
			knapsackHelper(n - 1, w - price) + 1
		);
		cache.set(key, result);
		return result;
	}

	// const maxTotalValue = knapsackHelper(items.length, total);

	const chosen = [];
	let remainingTotal = total;
	for (let i = items.length; i > 0 && remainingTotal > 0; i--) {
		const price = items[i - 1].product_variations.price;
		if (knapsackHelper(i, remainingTotal) !== knapsackHelper(i - 1, remainingTotal)) {
			chosen.push(items[i - 1]);
			remainingTotal -= price;
		}
	}

	return chosen;
}


const pickADamnThing = (vendorMenus, total: number) => {
	const FOUT = ['beverage', 'beverages', 'drinks', 'appetiziers', 'side order']
	const menus = vendorMenus.menu_categories.filter(x => !FOUT.includes(x.name.toLowerCase()));
	const flattenMenu = _.flatMap(menus, _.property('products'))
	const flattenVariations = _.flatten(
		flattenMenu.map(p => p.product_variations.map(v => ({ ...p, product_variations: v }))
		)
	);

	console.log(flattenVariations);
	return knapsack(flattenVariations, total)
}

let VENDOR_LOADED = false;
chrome.webRequest.onCompleted.addListener(async details => {
	// needs a better check
	if (details.url.includes('include') && !VENDOR_LOADED) {
		VENDOR_LOADED = true;
		try {
			const res = await fetch(details.url);
			const json = await res.json();
			const vendor = json.data;

			const chosen = pickADamnThing(vendor.menus[0], 30);
			console.log('CHOSEN', chosen, chosen.map(x => x.product_variations.price));

		} catch (e) {
			console.log(e);
		}
	}
}, { urls: ['*://*.fd-api.com/api/v5/vendors/*'] }, ['extraHeaders', 'responseHeaders']);


chrome.webRequest.onBeforeRequest.addListener(details => {
	console.log("onBeforeRequest", details.url, details);
	const postedString = decodeURIComponent(String.fromCharCode.apply(null, new Uint8Array(details.requestBody.raw[0].bytes)));
	console.log("postedString", postedString);
}, {
	urls: ['*://*.fd-api.com/api/v5/rs/cart/calculate*'],
}, ['requestBody', 'extraHeaders']);




console.log("background loaded");
