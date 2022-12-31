const fp = require( '../util/fetchPromise' )
const { DataType } = require( "@shopify/shopify-api" );

module.exports = {
    updateVariantPrice : async function ( variantId, price ) {
        try {
            const props = {
                path: `variants/${variantId}`,
                data: {
                    "variant" : {
                    "price" : price
                    }
                },
                type: DataType.JSON
            }
            const data = await fp.fetchPromisePut( props )
            return data.body.variant
        } catch (error) {
            return error
        }
    },

    getVariant : async function ( variantId ) {
        try {
            const props = {
                path: `variants/${variantId}`
            }

            const data = await fp.fetchPromiseGet( props )
            return data.body.variant
        } catch (error) {
            return error
        }
    },
 
  ///////////THIS NEEDS TO BE MODIFIED TO USE NEW FETCHPROMISE
  setVariantToTracked : async function( varId ) {
      setTimeout( async ()=>{
          console.log( varId )
          const data = await client.put({
              path: `variants/${ varId }`,
              data: {
                "variant": { 
                  "inventory_management": "shopify"
                }
              },
              type: DataType.JSON,
          } );
          return data.body
      }, 2500)
    }
  }

