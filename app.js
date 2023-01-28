const actionsVariants = require( './actions/variants' )
const actionsOrders = require( './actions/orders' )
const helpers = require( './helpers' )

const start = async () => {
    console.log( '*********** TRANSACTION BEGIN **************' )
    console.log( helpers.getDateTime() )
    console.log( '\n' )
    try {
        const products = await actionsVariants.updateVariantPrices()
        const response = await actionsVariants.resetPriceChanged( { json : JSON.stringify(products) })
        console.log( response )
    } catch (error) {
        console.log( error )
    }
    console.log( '\n' )
    console.log( helpers.getDateTime() )
    console.log( '*********** TRANSACTION END **************\n' )
}

const startTest = async () => {
    console.log( '*********** TRANSACTION BEGIN **************' )
    console.log( helpers.getDateTime() )
    console.log( '\n' )
    try {
        await actionsVariants.updateVariantPrices()
        await actionsVariants.resetPriceChanged( { json : JSON.stringify(products) })
        await actionsOrders.syncOrders()
    } catch (error) {
        console.log( error )
    }
    console.log( '\n' )
    console.log( helpers.getDateTime() )
    console.log( '*********** TRANSACTION END **************\n' )
}

startTest()
