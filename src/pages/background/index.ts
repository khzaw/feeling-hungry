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
	return knapsack(flattenVariations, total)
}

const PRICE_THRESHOLD = 30

let VENDOR_LOADED = false;
chrome.webRequest.onCompleted.addListener(async details => {
	// needs a better check
	if (details.url.includes('include') && !VENDOR_LOADED) {
		VENDOR_LOADED = true;
		try {
			const res = await fetch(details.url);
			const json = await res.json();
			const vendor = json.data;

			const chosen = pickADamnThing(vendor.menus[0], PRICE_THRESHOLD);
			const totalPrice = _.sum(chosen.map(x => x.product_variations.price));
			console.log('CHOSEN', chosen, totalPrice, chosen.map(x => x.product_variations.price));

			console.log('sending message');

			const vendorCart = {vendor_cart: [{
						container_charge: 0,
						discount_total: 0,
						discounted_subtotal: totalPrice,
						expedition_type: 'delivery',
						joker_offer_id: "",
						minimum_order_amount: PRICE_THRESHOLD - 5, // some arbitrary value
						minimum_order_amount_difference: 5,
						packaging_charge_details: null,
						payable_amount: totalPrice,
						rider_tip: 0,
						rider_tip_percentage: 0,
						rider_tip_type: "amount",
						subtotal: totalPrice,
						total_value: totalPrice,
						vat_total: totalPrice * 0.08,
						vendor_code: vendor.code,
						vendor_id: vendor.id,
						voucher: [],
						voucher_total: null,
						products: chosen,
			}]};

			chrome.tabs.query({
				active: true,
				currentWindow: true
			}, async (tabs) => {
				const activeTab = tabs[0];
				if (activeTab && activeTab.id) {
					const res = await chrome.tabs.sendMessage(activeTab.id, vendorCart);
					console.log('res', res);
					if(res !== null && res.storageSuccess){
						// move to next page
						console.log('updating', activeTab.id);
						chrome.tabs.update(activeTab.id, { url: `https://www-st.foodpanda.sg/checkout/${vendor.code}/payment?opening_type=delivery`});
					}
				}
			});



		} catch (e) {
			console.log(e);
		}
	}
}, { urls: ['*://*.fd-api.com/api/v5/vendors/*'] }, ['extraHeaders', 'responseHeaders']);


chrome.webRequest.onBeforeRequest.addListener(details => {
	console.log("onBeforeRequest", details.url, details);
	if(details.requestBody.raw) {
	const postedString = decodeURIComponent(String.fromCharCode.apply(null, new Uint8Array(details.requestBody.raw[0].bytes)));
	console.log("postedString", postedString);
	}
}, {
	urls: ['*://*.fd-api.com/api/v5/rs/cart/calculate*'],
}, ['requestBody', 'extraHeaders']);



const CART_URL = 'https://sg-st.fd-api.com/api/v5/rs/cart/calculate?include=expedition';

const submitToCart = async (products, vendor) => {
	const p = products.map(p => ({
		id: p.id,
		variation_id: p.product_variations.id,
		quantity: 1,
		toppings: [],
		special_instructions: "",
		sold_out_option: "REFUND",
		price: p.product_variations.price,
		original_price: p.product_variations.price_before_discount,
		variation_name: p.name,
		menu_id: null,
		menu_category_id: null,
		code: p.code,
		variation_code: p.product_variations.code
	}));

	const v = {
		code: vendor.code,
		hasDeliveryProvider: vendor.has_delivery_provider,
		id: vendor.id,
		latitude: vendor.latitude,
		longitude: vendor.longitude,
		marketplace: false,
		vertical: vendor.vertical || 'restaurants'
	}

	const payload = {
		allowanceAmount: 0,
		participants: [],
		voucher: null,
		auto_apply_voucher: false,
		supported_features: {
			supported_banned_products_soft_fail: false
		},
		joker_offer_id: "",
		vendor: v,
		products: p,
		payment: {
			methods: [],
			allowance_amount: 0,
			loyalty: {
				points: 0,
				selected_promotion_id: ""
			}
		},
		order_time: null,
		expedition: {
			type: "delivery",
			latitude: 1.433955,
			longitude: 103.8412354,
			rider_tip: {
				type: 'amount',
				amount: 0
			},
			delivery_address: {
				latitude: 1.433955,
				longitude: 103.8412354
			}
		}
	};

	// sample token
	const token = "eyJhbGciOiJSUzI1NiIsImtpZCI6ImtleW1ha2VyLXZvbG8tc3RhZ2luZyIsInR5cCI6IkpXVCJ9.eyJpZCI6InVoYWNiM2pwcGJkNjh0OWd1MGNmZWQ4MTZnbDdieWsxYTJuNjFtOWIiLCJjbGllbnRfaWQiOiJ2b2xvIiwidXNlcl9pZCI6InNnb3l4cGxqIiwiZXhwaXJlcyI6MTY4MTM2NTI4NCwidG9rZW5fdHlwZSI6ImJlYXJlciIsInNjb3BlIjoiQVBJX0NVU1RPTUVSIEFQSV9SRUdJU1RFUkVEX0NVU1RPTUVSIn0.nB82Dka2jxJ7mbVfPymDNDM2TM8h0jCtu1-PVRMb-YWhSL-ztawOnkLmjMG5LODf8NX5E_hqNDkOnISrkEx36w9yR3IINxLJFNOVUqGmK-k-jKdGcNmmcWAckZk67k5uvkuPSwMsdl7qtODHIjw8vJSEgy1fCqTcSFrft8AdE06lQEE5shXcvCznoYCJt4tMjUdWYon54a6qp325iL-bMRq-le1Q_DS4sc3bofN0qYsMjU6QmrGSML56jbBJrTrSagLHdJ08nnQOPOREFjUcNhzlgXHNhc1CnPeGhF0YHOcX_vQMyfiKvcX8jL8rapnNjU0S4Xi6xUd_6Nf2_nCadw"


	const res = await fetch(CART_URL, {
		headers: {
			accept: 'application/json',
			authorization: `Bearer ${token}`,
			"content-type": "application/json",
			"x-fp-api-key": "volo",
			"x-pd-language-id": "1",
			"referrer": "https://www-st.foodpanda.sg",
			"cache-control": "no-cache",
			body: JSON.stringify(payload),
			method: "POST",
			mode: "cors",
			credentials: "include"
		}
	});
	return await res.json();

}
