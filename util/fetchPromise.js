const { default: Shopify, DataType } = require( "@shopify/shopify-api" );
const client = new Shopify.Clients.Rest( "bytecell.myshopify.com", "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" );

module.exports = {

    fetchPromiseGet : ( props ) => {
        return new Promise( async ( resolve, reject ) => {
            try {
                const res = await client.get( props ) ;
                resolve( res )
            } catch ( error ) {
                reject( error.code )
            }
        })
    },

    fetchPromisePost : ( props ) => {
        return new Promise( async ( resolve, reject ) => {
            try {
                const res = await client.post( props ) ;
                resolve( res )
            } catch ( error ) {
                reject( error.code )
            }
        })
    },

    fetchPromisePut : ( props ) => {
        return new Promise( async ( resolve, reject ) => {
            try {
                const res = await client.put( props ) ;
                resolve( res )
            } catch ( error ) {
                console.log( error )
                reject( error.code )
            }
        })
    }

}