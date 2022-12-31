const fp = require( '../util/fetchPromise' )
const { DataType } = require( "@shopify/shopify-api" );

module.exports = {
    ///////////////THIS NEEDS TO BE MODIFIED
    setInventoryItemToTracked : async function ( variantId ) {
        try {
            const props = {
                path: `inventory_items/${ variantId }`,
                data: {
                    "inventory_item": { 
                        "tracked": true,
                    }
                },
                type: DataType.JSON,
            }

            const data = await fp.fetchPromisePut( props )
            return data.body.inventory_item
        } catch (error) {
            return error
        }
    },

    updateInventoryItemStock : async function ( locId, invItemId, stock ) {
        try {
            const props = {
                path: `inventory_levels/set`,
                data: {
                    "inventory_item_id" : invItemId,
                    "location_id" : locId,
                    "available": stock
                },
                type: DataType.JSON
            }

            const data = await fp.fetchPromisePost( props )
            return data.body.inventory_level
        } catch (error) {
            return error
        }
    },

    getInventoryItem : async function ( itemId ) {
        try {
            const props = {
                path: `inventory_items/${itemId}`
            }

            const data = await fp.fetchPromiseGet( props )
            return data.body.inventory_item
        } catch (error) {
            return error
        }
    }
}

