const actionsVariants = require( './actions/variants' )


const start = async () => {
    try {
        const products = await actionsVariants.updateVariantPrices()
        const response = await actionsVariants.resetPriceChanged( { json : JSON.stringify(products) })
        console.log( response )
    } catch (error) {
        console.log( error )
    }
}

start()