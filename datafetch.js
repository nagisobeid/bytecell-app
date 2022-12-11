const dotenv = require('dotenv').config();
const axios = require( 'axios' )

const HOST = process.env.HOST
const PORT = process.env.PORT

const getAllProducts = async () => {
    console.log('called')
    const response = await axios.get( `http://${HOST}:${PORT}/products` )
    return response.data.data
}

/*
const getAllVariants = async () => {
    const response = await axios.get( `http://${HOST}:${PORT}/variants` )
    return response.data.data
}


const getProductVariantsById = async ( bcid ) => {
    const response = await axios.get( `http://${HOST}:${PORT}/products/${ bcid }` )
    return response.data.data
}
*/

//returns object
const getProduct = async ( uuid, color, condition ) => {
    const response = await axios.get( `http://${HOST}:${PORT}/products/${ uuid }/${ color }/${ condition }` )
    return response.data.data[0]
}
/*
const getAllVariantIds = async () => {
    const response = await axios.get( `http://${HOST}:${PORT}/variants/ids` )
    //console.log( response.data.data)
    return response.data.data
}
*/
const getAllProductIds = async () => {
    const response = await axios.get( `http://${HOST}:${PORT}/products/ids` )
    //console.log( response.data.data)
    return response.data.data
}

const getProductsMissingImages = async ( ) => {
    const response = await axios.get( `http://${HOST}:${PORT}/images/missing` )
    return response.data.data
}

const getProductImages = async ( uuid ) => {
    const response = await axios.get( `http://${HOST}:${PORT}/images/${ uuid }` )
    return response.data.data
}

const mapImage = async ( payload ) => {
    const response = await axios.post( `http://${HOST}:${PORT}/images`, payload )
    //console.log( payload )
}


module.exports = {
    getAllProducts,
    getProduct,
    getAllProductIds,
    mapImage,
    getProductsMissingImages,
    getProductImages
}
