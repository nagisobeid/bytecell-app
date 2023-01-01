const dataFetch = require( '../../datafetch' )
const helpers = require( '../../helpers' )
const shpfyProducts = require( '../../api/products' )
const shpfyVariants = require( '../../api/variants' )
const shpfyLocations = require( '../../api/locations' )
const shpfyInventoryItem = require( '../../api/inventoryItem' )

module.exports = {
    updateVariantPrices :  async function() { 
        //get products that have a price change
        const location = await shpfyLocations.getLocations()
        const locId = location[0].id

        const products = await dataFetch.fetchProductsWithPriceChange()
        let retProds = { IDS : [] }

        for( let prod = 0; prod < products.length; prod++ ) {
	    //wait for 2 seconds, shopify implements a rate limiter
	    await new Promise(resolve => setTimeout( resolve, 1500 ));
            try {
                let product = await shpfyVariants.updateVariantPrice( products[prod].SHPFY_ID, products[prod].PRICE )
                await shpfyInventoryItem.updateInventoryItemStock( locId, product.inventory_item_id, products[prod].STOCK )
                retProds.IDS.push( { ID : products[prod].BYTECELL_ID } )
            } catch ( error ) {
                console.log( error )
            }
        }

        return retProds
    },

    resetPriceChanged : async function( products ) { //'{ "IDS" : [ { "ID": "290" }, { "ID": "291" }, { "ID": "821" }, { "ID": "822" }]}'
        try {
            let response = await dataFetch.resetPriceChangedFlag( products )
            return response.data
        } catch (error) {
            console.log( error )
        }
    }
}


async function begin() {
    //uuids = await dataFetch.getAllProductIds();
    uuids = await dataFetch.getProductsForShopify();
    //console.log( uuids )
    //return
    /*
    prodsInStore = await getAllProducts();
    handles = []
  
    for ( shProd = 0; shProd < prodsInStore.length; shProd++ ) {
      handles.push( prodsInStore[shProd].handle )
    }
    */
    //uuids = [{UUID: 'b5303639-e51f-47e0-b766-a42fc9e794e8'}]
    for ( uuid = 0; uuid < uuids.length; uuid++ ) {
      let prod = await dataFetch.getProductByUuid( uuids[uuid].UUID )
      let data = await helpers.prepareProductFromDB( prod )
      //console.log( data )
      
      await shpfyApi.createProduct( data )
      .then( async r => { 
        //console.log( r.id )
        let res = await dataFetch.updateProdSyncStatus( { UUID : uuids[uuid].UUID, INSHPFY : 1, SHPFYID :  r.id } )
        //console.log( res )
       })
      .catch( async err => {
        //console.log( err )
        let res = await dataFetch.updateProdSyncStatus( { UUID : uuids[uuid].UUID, INSHPFY : 0, SHPFYID :  0 } )
        //console.log( res )
      });
      
      
    }
  };

