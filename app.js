const actionsVariants = require( './actions/variants' )
const actionsOrders = require( './actions/orders' )
const helpers = require( './helpers' )

const start = async () => {
    console.log( '*********** TRANSACTION BEGIN **************' )
    console.log( helpers.getDateTime() )
    console.log( '\n' )
    try {
        let products = await actionsVariants.updateVariantPrices()
        let reset = await actionsVariants.resetPriceChanged( { json : JSON.stringify(products) })
        await actionsOrders.syncOrders()
	    console.log( 'resetPrices', reset )
    } catch (error) {
        console.log( error )
    }
    console.log( '\n' )
    console.log( helpers.getDateTime() )
    console.log( '*********** TRANSACTION END **************\n' )
}

start()
