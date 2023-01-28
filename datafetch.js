const dotenv = require('dotenv').config();
const axios = require( 'axios' )

const HOST = process.env.BYTECELLAPIHOST

const config = {
    headers:{
      'BYTECELLAPIKEY': process.env.BYTE_CELL_API_KEY
    }
};

const getAllProducts = async () => {
    try {
        const response = await axios.get( `http://${HOST}/products`, config )
        return response.data.data
    } catch ( err ) {
        return err.response.data.data
    }
}

const getProductByUuid = async ( uuid ) => {
    try {
        const response = await axios.get( `http://${HOST}/products/${ uuid }`, config )
        return response.data.data
    } catch ( err ) {
        return err.response.data.data
    }
}

const getProductsForShopify = async ( uuid ) => {
    try {
        const response = await axios.get( `http://${HOST}/products/shopify`, config )
        return response.data.data
    } catch ( err ) {
        return err.response.data.data
    }
}

//returns object
const getProduct = async ( uuid, color, condition ) => {
    try {
        const response = await axios.get( `http://${HOST}/products/${ uuid }/${ color }/${ condition }`, config )
        return response.data.data[0]
    } catch ( err ) {
        return err.response.data.data
    }
}

const getAllProductIds = async () => {
    try {
        const response = await axios.get( `http://${HOST}/products/ids`, config )
        //return response
        return response.data.data
    }
    catch ( err ) {
        //console.log( err )
        return err.response.data.message
    }
}

const getProductsMissingImages = async ( ) => {
    try {
        const response = await axios.get( `http://${HOST}/images/missing`, config )
        return response.data.data
    } catch ( err ) {
        return err.response.data.data
    }
}

const getProductImages = async ( uuid ) => {
    try {
        const response = await axios.get( `http://${HOST}/images/${ uuid }`, config )
        return response.data.data
    } catch ( err ) {
        return err.response.data.data
    }
}

const getProductsAndImgCount = async ( ) => {
    try {
        const response = await axios.get( `http://${HOST}/images/imgcount`, config )
        return response.data.data
    } catch ( err ) {
        return err.response.data.data
    }
}

const mapImage = async ( payload ) => {
    try {
        const response = await axios.post( `http://${HOST}/images`, payload, config )
    } catch ( err ) {
        return err
    }
}

const getReviews = async ( ) => {
    try {
        const response = await axios.get( `http://${HOST}/reviews`, config )
        return response.data.data
    } catch ( err ) {
        return err.response.data.data
    }
}

const getProdsMissingReviews = async ( ) => {
    try {
        const response = await axios.get( `http://${HOST}/reviews/missing`, config )
        return response.data.data
    } catch ( err ) {
        return err.response.data.data
    }
}

const renameReviews = async ( payload ) => {
    try {
        const response = await axios.put( `http://${HOST}/reviews/rename`, payload, config )
        return response
    } catch ( err ) {
        return err
    }
}

const insertReviews = async ( payload ) => {
    try {
        const response = await axios.post( `http://${HOST}/reviews`, payload, config )
        return response
    } catch ( err ) {
        return err
    }
}

const updateProdSyncStatus = async ( payload ) => {
    try {
        const response = await axios.post( `http://${HOST}/products/syncstatus`, payload, config )
        return response
    } catch ( err ) {
        return err
    }
}

const fetchVariantsForSeeding = async () => {
    try {
        return await axios.get( `http://${HOST}/products/shopify/variants/seeding`, config )
    } catch (error) {
        return error
    }
}

const fetchProductsWithPriceChange = async () => {
    try {
        const response = await axios.get( `http://${HOST}/products/pricechanged`, config )
        return response.data
    } catch (error) {
        return error
    }
}

const insertVariantsForSeeding = async ( payload ) => {
    try {
        return await axios.post( `http://${HOST}/products/shopify/variants/seeding`, payload, config )
    } catch (error) {
        return error
    }
}

const resetPriceChangedFlag = async ( payload ) => {
    try {
        return await axios.put( `http://${HOST}/products/resetpricechanged`, payload, config )
    } catch (error) {
        return error
    }
}

const getOrders = async () => {
    try {
        const response = await axios.get( `http://${HOST}/orders`, config )
        return response.data
    } catch (error) {
        return error
    }
}

const postOrders = async ( payload ) => {
    try {
        const response = await axios.post( `http://${HOST}/orders`, payload, config )
        return response.data
    } catch (error) {
        return error
    }
}

module.exports = {
    getAllProducts,
    getProduct,
    getAllProductIds,
    mapImage,
    getProductsMissingImages,
    getProductImages,
    getProductByUuid,
    getProductsAndImgCount,
    getProductsForShopify,
    getReviews,
    renameReviews,
    getProdsMissingReviews,
    insertReviews,
    updateProdSyncStatus,
    fetchVariantsForSeeding,
    insertVariantsForSeeding,
    fetchProductsWithPriceChange,
    resetPriceChangedFlag,
    getOrders,
    postOrders
}
