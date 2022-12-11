const { default: Shopify, DataType } = require( "@shopify/shopify-api" );
// const products = require( './Objects' );
var Connection = require( 'tedious' ).Connection;  
var Request = require( 'tedious' ).Request; 
var Multimap = require( 'multimap' );
const { raw } = require( "express" );
const client = new Shopify.Clients.Rest( "bytecell.myshopify.com", "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" );
const response = client.get( { path: 'shop' } );
const productImagesPath = 'C:/Users/nagis/OneDrive/bytecell/images';
const axios = require( 'axios' )
const dataFetch = require( './datafetch' )
const helpers = require( './helpers' )

async function setInventoryItemToTracked( variantId ) {
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
}

async function updateInventoryItemStock( variantId, invItemId, stock ) {
    const data = await client.put( {
        path: `inventory_levels/set.json`,
        data: {
            "inventory_level": { 
                "inventory_item_id": invItemId,
                "available": stock,
            }
          },
          type: DataType.JSON,
      } );

      return data.body
}

async function getProduct( productId ) {
    const data = await client.get( {
        path: `products/${ productId }`,
      } );
      return data.body.product;
}

async function getAllProducts() {
    const data = await client.get( {
      path: 'products',
    }) ;
    return data.body.products
}

const updateProductAssingImagesToVariants = async function( prod ) {
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
}

const createProduct = async function( prod ) {
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
          "handle"    :   ( prod.title + '-' + prod.id ),
          "body_html" :   "",
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
}

const setVariantToTracked = async function( varId ) {
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

//steps variants will need to be assembled into a single product object for shopify API
 /*dataFetch.getProductVariantsById( 14356 )
  .then( variants => {
    helpers.prepareProductVariantsFromDB( variants )
    .then( productObject => {
     createProduct( productObject ).then(r => {
      getAllProducts().then( r => {
        console.log( r[0].variants )
      })
     })
    })
  })
*/

async function begin() {
  ids = await dataFetch.getAllVariantIds();
  for ( id = 0; id < ids.length; id++ ) {
    let variants = await dataFetch.getProductVariantsById( ids[id].bcid )
    let data = await helpers.prepareProductVariantsFromDB( variants )
    await createProduct( data )
    .then( r => { })
    .catch( err => {
      console.log( err )
    });
  }
};

async function begin2() {
  ids = await dataFetch.getAllVariantIds();
  for ( id = 0; id < 20; id++ ) {
    let variants = await dataFetch.getProductVariantsById( ids[id].bcid )
    let data = await helpers.prepareProductVariantsFromDB( variants )
    await createProduct( data )
    .then( r => { })
    .catch( err => {
      console.log( err )
    });
  }
};
  
begin()
  

/*
var m = new Multimap();
for (product of products) {
  m.set(product.title, product);
}

m.forEachEntry(function (entry, key) {
  let r = prepareProduct(m.get(key));
  createProduct(r).then( p => {
    let data = {id: p.id}
      let images = [];
      r.images.forEach ( i => {
        let variant_ids = [];
        r.variants.forEach( v => {
          if (i.src.toUpperCase().includes(v.title.toUpperCase().substring(0, 3))) {
            variant_ids.push(v.id);
          }
        })
        images.push({"id": i.id, "variant_ids": variant_ids})
      })
      data.imagesData = images;
      updateProductAssingImagesToVariants(data);
  });
});
*/


/*
getAllProducts().then( async r => {
    for ( i = 0; i < r.length; i++) {
        for (j=0; j < r[i].variants.length; j++) {
            //console.log(r[i].variants[j].id);
            variants.push(r[i].variants[j].id);
        }
    }
    for (variant = 0; variant < variants.length; variant++) {
        
    }
})

*/

/*
getAllProducts().then( async r => {
    for ( i = 0; i < r.length; i++) {
        //console.log(r[i])
        for (j=0; j < r[i].variants.length; j++) {
            //console.log(j)
            //console.log(r[i].variants[j].id);
            await setVariantToTracked(r[i].variants[j].id);
        }
    }
})
*/
