const stringSimilarity  = require( 'string-similarity' )
const dotenv = require('dotenv').config();
//const imageMaster = require ( './imageMaster' )
const fs = require('fs');

const dataFetch = require( './datafetch' );
const bodyParser = require('body-parser');
const shpfyApi = require('./api');
const { default: Shopify } = require('@shopify/shopify-api');
const { response } = require('express');



const getDateTime = function() {
	let date_ob = new Date();
	let day = ("0" + date_ob.getDate()).slice(-2);
	let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
	let year = date_ob.getFullYear();
   
	let date = year + "-" + month + "-" + day;
    
	let hours = date_ob.getHours();
	let minutes = date_ob.getMinutes();
	let seconds = date_ob.getSeconds();
  
	let dateTime = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
	return dateTime;	
}

// This function returns the data object in the proper Shopify 'product' format
const prepareProductFromDB = async function( prod ) {
    //console.log( prod[0] )

    let UUID = ''
    try {
        UUID = prod[0].uuid
    } catch {
        console.log( 'DOES NOT EXIST' )
        return
    }

    let data = {
      UUID,
      title     :   '',
      images    :   [],
      options   :   [],
      variants  :   [],
      metafield :   prod[0].title,
      body      :   ''
    }

    data.body = parseSpecs( prod[0] )

    try {
        await dataFetch.getProductImages( UUID ).then( imgs => {
            imgs.forEach( img => {
                i = {
                    "src"   :   `${process.env.IMGSBUCKET}${img.imgName}`
                }
                data.images.push( i )
            });
        })
    }
    catch {
        console.log( 'NOT IMAGES' )
    }
  
    data.title = prod[0].title;
    let color = { "name": "color", "values": []};           //option1
    let storage = { "name": "storage", "values": []};       //option2
    let condition = {"name": "condition", "values": []};    //option3
  
    prod.forEach( option => {
        if ( !color.values.includes( option.color ) ) {
            color.values.push( option.color )
        }
        if ( !storage.values.includes( option.storage ) ) {
            storage.values.push( option.storage );
        }
        if ( !condition.values.includes( option.condition ) ) {
            condition.values.push( option.condition );
        } 
    })
    
    // checking that at least one value for an option exists, if not then we exclude option as a variant
    if ( color.values[0] ) {
        data.options.push( color );
    }
    if ( storage.values[0] ) {
        data.options.push( storage );
    }
    if ( condition.values[0] ) {
        data.options.push( condition );
    }
    //data.options.push( color, storage, condition );
    //console.log( data.options )
    prod.forEach( variant => {
        let inv = 0;
        let price = 0.00;
        if ( !variant.price ) {
            price = 0.00;
            inv = 0;
        } else if ( variant.price ) {
            if ( variant.price > 0 ) {
                price = variant.price;
                inv = 1;
            } else if ( variant.price < 0.01 ) {
                price = 0.00;
                inv = 0;
            }
        } 

        let variantData = { 
            //"barcode": `${ data.title } - ${ data.options[0].values[i] } - ${ data.options[1].values[j] } - ${ data.options[2].values[k] }`,
            "barcode"               : variant.id,
            "inventory_quantity"    : inv,
            "price"                 : price.toFixed(2), 
            "inventory_management"  : "shopify"
        };

        //add dynamic options based on ealrlier if statement
        let optionOrder = 1
        data.options.forEach( o => {
            variantData[`option${optionOrder}`] = variant[`${o.name}`]
            optionOrder = optionOrder + 1
        })
        //console.log(variantData)
        //"option1"               : variant.color,//data.options[0].values[i],
        //"option2"               : variant.storage,//data.options[1].values[j],
        //"option3"               : variant.condition,//data.options[2].values[k],

        data.variants.push( variantData );
    } ) 
    //return
    //data.options[0] = color //data.options[1] = storage //data.options[2] = condition
    /*
    for ( let i = 0; i < data.options[0].values.length; i++ ) {
        for ( let j = 0; j < data.options[1].values.length; j++ ) {
            let price = false
            for ( let k = 0; k < data.options[2].values.length; k++ ) {
                let price = await getProductPrice( UUID, data.options[0].values[i], data.options[2].values[k] )
                console.log( UUID,data.options[0].values[i], data.options[2].values[k] )
                return
                const vrnt = await dataFetch.getProduct( UUID, data.options[0].values[i], data.options[2].values[k] )
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
    */
    return data;
  }


const mapImagesToProducts = async ( ) => {
    basePath = 'C:/Users/nagis/OneDrive/bytecell/dec142022'

    products = await dataFetch.getProductsMissingImages()
    
    for ( let p = 0; p < products.length; p++ ) {
        try {
            const path = basePath + '/' + String( products[p].uuid )
           
            if ( fs.existsSync( path ) ) {
                let imgs = fs.readdirSync( path )
                //let dirImgCount = imgs.length
                //if dirImgCount
                for ( let i = 0; i < imgs.length; i++ ) {
                    let payload = {
                        UUID            :   products[p].uuid,
                        TITLE           :   products[p].title,
                        IMGNAME         :   imgs[i]
                    }
                    //console.log( payload )
                    await dataFetch.mapImage( payload )
                }
                
            } else {
              console.log(`Dir not found. Images needed for ${ products[p].title } `)
            }
          } catch( e ) {
            console.log("An error occurred.")
          }
    }
    //} )
}

const mapImagesThatHaveUnmatchedImgCount = async ( ) => {
    basePath = 'C:/Users/nagis/OneDrive/bytecell/testing'

    products = await dataFetch.getProductsAndImgCount()
   
    for ( let p = 0; p < products.length; p++ ) {
        try {
            const path = basePath + '/' + String( products[p].uuid )
           
            if ( fs.existsSync( path ) ) {
                let imgs = fs.readdirSync( path )
                let dirImgCount = imgs.length
                if ( products[p].imgsindb < dirImgCount ) {
                    for ( let i = 0; i < imgs.length; i++ ) {
                        let payload = {
                            UUID            :   products[p].uuid,
                            TITLE           :   products[p].title,
                            IMGNAME         :   imgs[i]
                        }
                        await dataFetch.mapImage( payload )
                    }
                    console.log( dirImgCount, products[p].imgsindb, products[p].uuid )
                }
                
            } else {
              //console.log(`Dir not found. Images needed for ${ products[p].title } `)
            }
          } catch( e ) {
            //console.log("An error occurred.")
          }
    }
}

const parseSpecs = ( prod ) => {
    //products = await dataFetch.getAllProducts()
    //products = await dataFetch.getProductByUuid( '6d50818d-1ccb-408a-84bb-cf27296fd821' )
    //products = [ products[0] ]
    //console.log( products )
    //return

    try {
        let obj = prod.specs//.replaceAll('"', "NSO")
        obj = removeQuote( obj )
        obj = prod.specs.replaceAll(`'`, `"`)
        obj = removeCommas( obj )
       
        let s = JSON.parse( obj )
        return makeHtml( s.specs )

    } catch( e ) {
        console.log( e )
        return '<p>Looks like something went wrong<br>Check back later for data</p>'
    }
    
    /*
    let count = 0
    products.forEach( prod => {
        try {
            let obj = prod.specs//.replaceAll('"', "NSO")
            obj = removeQuote( obj )
            obj = prod.specs.replaceAll(`'`, `"`)
            obj = removeCommas( obj )
           
            let s = JSON.parse( obj )
            let html = makeHtml( s.specs )
   
        } catch( e ) {

            count++
        }
    })
    
    //console.log( count )
    */
}

const removeCommas = function( jsonString ) {
    let count = 1
    let newStr = ''
    for (let i = 0; i < jsonString.length; i++) {
        if ( jsonString[i] == ',' ) {
            if(isNumber(jsonString[i + 1 ] ) || isNumber(jsonString[i - 1 ] )) { 
                newStr = newStr + ''
                continue
            } else {
                count++
            }
        }
        newStr = newStr + jsonString[i]
    }
    return newStr
}

const removeQuote = function( jsonString ) {
    let count = 1
    let newStr = ''
    for (let i = 0; i < jsonString.length; i++) {
        if ( jsonString[i] == '"' ) {
            if(isNumber(jsonString[i + 1 ] ) || isNumber(jsonString[i - 1 ] )) { 
                newStr = newStr + ''
                continue
            } else {
                count++
            }
        }
        newStr = newStr + jsonString[i]
    }
    return newStr
}

const makeHtml = function( data ) {
    html = `<table class="data-table">`
    data.forEach( spec => {
        html = html + `<tr><td>${ spec.display }</td><td>${ spec.values[0].label }</td></tr>`
        //console.log( spec.display + ' <----> ' + spec.values[0].label )
    } )
    html = html + `</table>`
    return html
}

function isNumber(str) {
    return /\d/.test(str);
  }

const renameReviews = async function( ) {
    reviews = await dataFetch.getReviews()
    names = reviews.map( r => {
        return r.FN
    })
    
    const reversedNames = names.reverse();

    r = reviews.map( ( review, idx ) => {
        return {
            UUID : review.UUID,
            ID   : review.ID,
            FN   : reversedNames[idx]
        }
    } )

    let revs = splitArrayIntoChunks( r, 5880 )
    
    // data is too large
    // send 15 individual requests
    for ( let i = 0; i < revs.length; i++ ) {
        let res = await dataFetch.renameReviews( { REVIEWS : revs[i] } )
    }

}


function splitArrayIntoChunks( arr, size ) {
    
    let arrays = []
    for (let i = 0; i < arr.length; i += size)
        arrays.push(arr.slice(i, i + size));

    return arrays
}

const generateFakeReviews = async function() {
    let missing = await dataFetch.getProdsMissingReviews()

    const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
    
    const reviews = await dataFetch.getReviews()

    let names = reviews.map( r => {
        return r.FN
    })

    let createdReviews = []
    //create reviews here
    //missing = [ missing[0] ]
    missing.forEach( prod => {

        //generate random number of reviews
        let numReviews = Math.floor( Math.random() *  ( 9 - 1 ) + 1 );

        for ( let i = 0; i < numReviews; i++ ) {

            //gen random data values
            let fnIdx = Math.floor( Math.random() *  ( names.length - 0 ) + 0 );
            let lnIdx = Math.floor( Math.random() *  ( alphabet.length - 0 ) + 0 );
            let rate = Math.floor( Math.random() *  ( 5 - 1 ) + 1 );
            let datePur = randomDate('02/13/2019', '12/10/2022')
            let dateRev = randomDate( addDays( datePur, 5 ) , addDays( datePur, 45 ))

             //set a review object template to populate
            revObj = {
                UUID            :   prod.UUID,
                FN              :   names[fnIdx],
                LN              :   alphabet[lnIdx],
                DATEREVIEW      :   dateRev,
                DATEPURCHASE    :   datePur,
                RATE            :   rate,
                COMMENT         :   'Customer only left a Rating'
            }
            createdReviews.push( revObj )
        }
    } )

    //change the second param value as needed sometimes it does not propogate the data to API and SQL??? look into it
    let revs = splitArrayIntoChunks( createdReviews, 100 )
    
    // data is too large
    // send individual batched requests
    for ( let i = 0; i < revs.length; i++ ) {
        //console.log( revs[i] )
        let res = await dataFetch.insertReviews( { REVIEWS : revs[i] } )
        console.log( res.data )
    }
}

function randomDate(date1, date2){
    function randomValueBetween(min, max) {
      return Math.random() * (max - min) + min;
    }
    var date1 = date1 || '01-01-1970'
    var date2 = date2 || new Date().toLocaleDateString()
    date1 = new Date(date1).getTime()
    date2 = new Date(date2).getTime()
    if( date1>date2){
        return new Date(randomValueBetween(date2,date1)).toLocaleDateString()   
    } else{
        return new Date(randomValueBetween(date1, date2)).toLocaleDateString()  

    }
}


function addDays( date, days ) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toLocaleDateString();
}

const seedVariantKeyes = async function() {
    //get all prods from DB
    let response = await dataFetch.fetchVariantsForSeeding()
    let dbProds = response.data.data
    
    if ( dbProds.length > 0 ) {
        //get all prods from SHPFY
        let shProds = await shpfyApi.getAllProducts();

        //extract the variants and parent id
        let shVariants = shProds.map( prod => {
            return { 
                parentID : prod.id,
                variants : prod.variants 
            }
        })

        let mapped = []

        // find matches
        dbProds.forEach( dbP => {
            shVariants.forEach( p => {
                if ( dbP.ParentShpfyID == p.parentID ) {
                    p.variants.forEach( v => {
                        if ( v.title.includes( dbP.condition ) ) {
                        //if ( dbP.condition == v.title ) {
                            mapped.push( {
                                BCID : dbP.id,
                                Parent : p.parentID,
                                Condition : v.title,
                                VariantID : v.id
                            } )
                        }
                    } )
                }
            })
        } )
        
        //final filter
        const v = mapped.map( variant => {
            return {
                SHPFY_ID    : variant.VariantID,
                BYTECELL_ID : variant.BCID
            }
        } )

        let resp = await dataFetch.insertVariantsForSeeding( { VARIANTS : v } )
        console.log( resp )
    } else {
        console.log( dbProds.length )
    }
    
}

async function testing() {
    //console.log ( await shpfyApi.getProductCount() )
    //console.log( await shpfyApi.getVariant( 8034876522730 ) )
    //let p = await shpfyApi.getProduct( 8034876522730 )
    let x = await dataFetch.getAllProductIds()
    console.log( x )
    //console.log( p.variants )
}
//testing()

//seedVariantKeyes()


module.exports = {
    prepareProductFromDB,
    parseSpecs,
    getDateTime
}
