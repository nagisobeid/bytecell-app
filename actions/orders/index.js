const dataFetch = require( '../../datafetch' )
const helpers = require( '../../helpers' )

const shpfyLocations = require( '../../api/locations' )
const shpfyOrders = require( '../../api/orders' )

module.exports = {
    syncOrders : async function() {
        //get shopify orders
        const ordersSh = await shpfyOrders.getAllOrders()
        //console.log( ordersSh )
        //get orders in db
        const ordersDb = await dataFetch.getOrders()
        //insert only the orders that do not exist in the db
        //filter them here

        let o = []
        if ( ordersDb.length > 0 ) {
            ordersSh.forEach( sO => {
                let found = false
                for( let dO of ordersDb ) {
                    if ( sO.id == dO.id ) {
                        //console.log( 'break' )
                        found = true
                        break
                    }
                }
                if ( !found ) {
                    o.push( sO )
                }
            });
        } else {
            o = ordersSh
        }

        o = o.map( n => {
            return {
                id : n.id,
                browser_ip : n.browser_ip,
                checkout_id : n.checkout_id,
                created_at : n.created_at,
                processed_at : n.processed_at,
                subtotal_price : n.subtotal_price,
                total_price : n.total_price,
                order_number : n.order_number
            }
        })
        //console.log( o )
        if ( o.length > 0 ) {
            let res = await dataFetch.postOrders(  { ORDERS : o } )
            console.log( res )
        }
    }
}
