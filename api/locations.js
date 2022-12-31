const fp = require( '../util/fetchPromise' )

module.exports = {
    getLocations : async function () {
        const props = {
            path : 'locations'
        }

        try {
            let data = await fp.fetchPromiseGet( props )
            return data.body.locations
        } catch ( error ) {
            return error
        }
    }
}

