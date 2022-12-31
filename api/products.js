const fp = require( '../util/fetchPromise' )

module.exports = {
    
    getProduct : async function ( productId ) {
        let props = {
            path : `products/${ productId }`
        }

        try {
            let data = await fp.fetchPromiseGet( props )
            return data.body.product
        } catch ( error ) {
            return error
        }
    },

    getAllProducts : async function () {
        const path = 'products'
        let allProds = []
        let query = { limit : 250 }
    
        while( true ) {
            let props = {
                path,
                query
            }

            try {
                let data = await fp.fetchPromiseGet( props )
                allProds = allProds.concat( data.body.products )

                if ( data.pageInfo.nextPageUrl ) {
                    query = data.pageInfo.nextPage.query
                    //continue
                } else {
                    return allProds
                }

            } catch ( error ) {
                return error
            }
        }
      },

    getProductCount : async function () {
        let props = {
            path : `products/count`
        }

        try {
            let data = await fp.fetchPromiseGet( props )
            return data.body.count
        } catch ( error ) {
            return error
        }
    },
    
    ////////////////THIS NEEDS UPDATING
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
    
    ////////////////THIS NEEDS UPDATING
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
    }
}
