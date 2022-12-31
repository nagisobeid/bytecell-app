const { default: Shopify, DataType } = require( "@shopify/shopify-api" );
// const products = require( './Objects' );
var Connection = require( 'tedious' ).Connection;  
var Request = require( 'tedious' ).Request; 
var Multimap = require( 'multimap' );
const { raw } = require( "express" );
const client = new Shopify.Clients.Rest( "bytecell.myshopify.com", "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" );
const response = client.get( { path: 'shop' } );
//const productImagesPath = 'C:/Users/nagis/OneDrive/bytecell/images';
const axios = require( 'axios' )
const dataFetch = require( './datafetch' )
const helpers = require( './helpers' )

module.exports = {
  setInventoryItemToTracked : async function ( variantId ) {
    const data = await client.put( {
        path: `inventory_items/${ variantId }`,
        data: {
            "inventory_item": { 
                "tracked": true,
            }
          },
          type: DataType.JSON,
      } );

      return data.body
  },

  updateInventoryItemStock : async function ( locId, invItemId, stock ) {
  
      const data = await client.post( {
          path: `inventory_levels/set`,
          data: {
                  "inventory_item_id" : invItemId,
                  "location_id" : locId,
                  "available": stock
          },
          type: DataType.JSON
        } );

        return data.body
  },

  updateVariantPrice : async function ( variantId, price ) {
  
    const data = await client.put( {
        path: `variants/${variantId}`,
        data: {
          "variant" : {
            "price" : price
          }
        },
        type: DataType.JSON,
      } );

      return data
  },

  getProduct : async function ( productId ) {
    const data = await client.get( {
        path: `products/${ productId }`,
      } );
      return data.body.product;
  },

  getLocation : async function ( ) {
    const data = await client.get( {
        path: `locations`,
      } );
      return data.body.locations;
  },

  getVariant : async function ( variantId ) {
    const data = await client.get( {
        path: `variants/${ variantId }`,
      } );
      return data.body.variant;
  },

  getInventoryItem : async function ( itemId ) {
    const data = await client.get( {
        path: `inventory_items/${ itemId }`,
      } );
      return data.body.inventory_item;
  },

  getAllProducts : async function () {
    const path = 'products'
    let allProds = []
    let query = { limit : 250 }

    while( true ) {
      let data = await client.get( {
        path,
        query
      }) ;

      allProds = allProds.concat( data.body.products )
      //return allProds
      //console.log( data )
      if ( data.pageInfo.nextPageUrl ) {
        //console.log( data.pageInfo.nextPage.query )
        query = data.pageInfo.nextPage.query
        //continue
      } else {
        return allProds
      }
    }
  },

  getAllProductsxx : async function () {
    const data = await client.get( {
      path: `products`,
      query : { limit : 250 }
    }) ;
    console.log( data )
    return data.body.products
  },

  getProductCount : async function () {
    const data = await client.get( {
      path: `products/count`
    }) ;
    return data.body
  },

  updateProductAssingImagesToVariants : async function( prod ) {
    const data = await client.put( {
          path: `products/${ prod.id }`,
          data: {
              "product": {  
                  "images"  : [ ...prod.imagesData],
              }
          },
          type: DataType.JSON,
      } );
      return data.body.product
  },

  createProduct : async function( prod ) {
    try {
      const data = await client.post({
        path: 'products',
        data: {
          "product" : {
            "title"     :   prod.title,
            "vendor"    :   "bytecell",
            "tags"      :   prod.title, 
            "status"    :   "active",
            "images"    :   [ ...prod.images ],
            "options"   :   [ ...prod.options ],
            "variants"  :   [ ...prod.variants ],
            "handle"    :   prod.title + '-' + prod.UUID,
            //"handle"    : prod.handle,
            "body_html" :   prod.body,
            "metafields_global_title_tag"       : prod.metafield,
            "metafields_global_description_tag" : prod.metafield
          }
        },
        type: DataType.JSON,
      });
      //console.log(data.body.prouct);
      return data.body.product
      
    } catch ( error ) {
      console.log( error )
      setTimeout(() => {
        console.log( 'WAITING' )
      }, 3000 );
    }
  },
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

