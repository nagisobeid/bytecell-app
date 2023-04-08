const fp = require( '../util/fetchPromise' )

module.exports = {
    
    getOrders : async function ( ) {
        let props = {
            path : `orders`,
            query : { status : 'any' }
        }

        try {
            let data = await fp.fetchPromiseGet( props )
            return data.body.orders
        } catch ( error ) {
            return error
        }
    },

    getAllOrders : async function () {
        const path = 'orders'
        let allOrders = []
        let query = { limit : 250, status : 'any' }
    
        while( true ) {
            let props = {
                path,
                query
            }

            try {
                let data = await fp.fetchPromiseGet( props )
                allOrders = allOrders.concat( data.body.orders )

                if ( data.pageInfo.nextPageUrl ) {
                    query = data.pageInfo.nextPage.query
                    //continue
                } else {
                    return allOrders
                }

            } catch ( error ) {
                return error
            }
        }
      },

    getOrder : async function ( productId ) {
        let props = {
            path : `products/${ productId }`
        }

        try {
            let data = await fp.fetchPromiseGet( props )
            return data.body.product
        } catch ( error ) {
            return error
        }
    }
}
