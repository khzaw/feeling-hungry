// const FETCH_VENDOR_API_URL = "https://staging.disco.deliveryhero.io/listing/api/v1/pandora/vendors"

const FETCH_VENDOR = "https://staging.disco.deliveryhero.io/listing/api/v1/pandora/vendors?latitude=1.391084&longitude=103.888715&language_id=1&include=characteristics&configuration=Variant3&country=sg&customer_id=sg9kpxo6&customer_hash=91bec2c80453b1811e39206a2675d35e&budgets=&cuisine=&sort=&payment_type=&food_characteristic=&use_free_delivery_label=true&tag_label_metadata=true&vertical=darkstores&vertical_type_ids=&limit=1&offset=0&customer_type=regular"

const fetchVendors = (): Promise<any> => {
    return fetch(FETCH_VENDOR)
        .then(response => {
            console.log('Here is the response', response);
            return response.json();
        })
        .catch(error => {
            console.log(error);
        })
}

export {
    fetchVendors,
}
