const jwt = require('jsonwebtoken');

const generarJWT = ( uid = '' ) => {

    return new Promise( (resolve, reject) => {

        const payload = { uid };

        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h' //Lo que va a durar sin expirar el JWT
        }, ( err, token ) => {
            if( err ){
                console.log( err );
                reject( 'No se pudo generar el token' )
            }else{
                resolve( token )
            }
        })

    })

}

module.exports = {
    generarJWT
}