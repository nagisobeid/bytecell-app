const stringSimilarity  = require( 'string-similarity' )
const imageMaster = require ( './imageMaster' )
const fs = require('fs');

const dataFetch = require( './datafetch' );

const getProductPrice = async( uuid, color, condition ) => {
    let product = await dataFetch.getProduct( uuid, color, condition );
    return product.BC_Price;
}


const prepareProductVariantsFromDB = async function( prod ) {
    let id = 0
    try {
        id = prod[0].BCID
    } catch {
        console.log( 'DOES NOT EXIST' )
        return
    }

    let data = {
      id        :   id,
      title     :   '',
      images    :   [],
      options   :   [],
      variants  :   [],
      metafield :   prod[0].Title
    }

    try {
        await dataFetch.getProductImages( id ).then( imgs => {
            imgs.forEach( img => {
                i = {
                    "src"   :   `https://cdn.shopify.com/s/files/1/0610/3049/8538/files/${img.imgName}`
                }
                data.images.push( i )
            });
        })
    }
    catch {
        console.log( 'NOT IMAGES' )
    }
  
    data.title = prod[0].Model;
    let color = { "name": "Color", "values": []};
    let storage = { "name": "Storage", "values": []};
    let condition = {"name": "Condition", "values": []};
  
    prod.forEach( p => {
      if ( !color.values.includes( p.Color ) ) {
          color.values.push( p.Color )
      }
      if ( !storage.values.includes( p.Storage ) ) {
          storage.values.push( p.Storage );
      }
      if ( !condition.values.includes( p.Condition) ) {
          condition.values.push( p.Condition );
      } 
    })
  
    data.options.push( color, storage, condition );
    //data.options[0] = color //data.options[1] = storage //data.options[2] = condition
    for ( let i = 0; i < data.options[0].values.length; i++ ) {
        for ( let j = 0; j < data.options[1].values.length; j++ ) {
            let price = false
            for ( let k = 0; k < data.options[2].values.length; k++ ) {
                let price = await getProductPrice( id, data.options[0].values[i], data.options[2].values[k] )
                const vrnt = await dataFetch.getProduct( id, data.options[0].values[i], data.options[2].values[k] )
                const vrntID = vrnt.ID
                
                let inv = 0;
                if ( !price ) {
                    price = 0.00;
                    inv = 0;
                } else if ( price ) {
                    if ( price > 0 ) {
                        inv = 1;
                    } else if ( price < 0.01 ) {
                        price = 0.00;
                        inv = 0;
                    }
                } 

                let variant = { 
                    //"barcode": `${ data.title } - ${ data.options[0].values[i] } - ${ data.options[1].values[j] } - ${ data.options[2].values[k] }`,
                    "barcode"               : vrntID,
                    "inventory_quantity"    : inv,
                    "price"                 : price, 
                    "option1"               : data.options[0].values[i],
                    "option2"               : data.options[1].values[j],
                    "option3"               : data.options[2].values[k],
                    "inventory_management"  : "shopify"
                };

                data.variants.push( variant );
            }
        }
    }

    return data;
  }


const mapImagesToVariants = ( products ) => {
    basePath = 'C:/Users/nagis/OneDrive/bytecell/testing'
   
    products.forEach( product => {
        try {
            const path = basePath + '/' + String( product.BCID )
           
            if ( fs.existsSync( path ) ) {
                let imgs = fs.readdirSync( path )
                imgs.forEach( async image => {
                    let payload = {
                        imgName         :   image,
                        bcid            :   product.BCID,
                        variantTitle    :   product.Title,
                        id              :   product.ID
                    }
                    await dataFetch.mapImage( payload )
                })
                
            } else {
              console.log(`Dir not found. Images needed for ${ product.Title } `)
            }
          } catch( e ) {
            console.log("An error occurred.")
          }
    } )
}


module.exports = {
    prepareProductVariantsFromDB,
    getProductPrice
}
