const actionsVariants = require( './actions/variants' )
const helpers = require( './helpers' )

const start = async () => {
    console.log( '*********** TRANSACTION BEGIN **************\n' )
    console.log( helpers.getDateTime() )
    try {
        //const products = await actionsVariants.updateVariantPrices()
        //const response = await actionsVariants.resetPriceChanged( { json : JSON.stringify(products) })
        console.log( 'task here' )
    } catch (error) {
        console.log( error )
    }
    console.log( helpers.getDateTime() )
    console.log( '\n' )
    console.log( '*********** TRANSACTION END **************\n' )
}

start()
